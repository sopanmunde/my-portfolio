"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "@/components";
import styles from "./Projects.module.scss";

interface Project {
  slug: string;
  content: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    images: string[];
    tag?: string;
    tags?: string[];
    team: { name: string; avatar: string; linkedIn: string; role: string }[];
    link?: string;
  };
}

interface ProjectsClientProps {
  projects: Project[];
  showControls?: boolean;
}

export function ProjectsClient({ projects, showControls = true }: ProjectsClientProps) {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  // Read saved layout preference on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem("portfolio-projects-layout") as "grid" | "list";
    if (savedLayout === "grid" || savedLayout === "list") {
      setLayout(savedLayout);
    }
  }, []);

  const handleLayoutChange = (newLayout: "grid" | "list") => {
    setLayout(newLayout);
    localStorage.setItem("portfolio-projects-layout", newLayout);
  };

  // Compile all unique tags across all projects
  const allTags = ["All", ...Array.from(new Set(projects.flatMap(p => p.metadata.tags || [])))];

  // Filter projects by selected tag
  const filteredProjects = selectedTag === "All"
    ? projects
    : projects.filter(p => p.metadata.tags?.includes(selectedTag));

  return (
    <div className={styles.projectsContainer}>
      {showControls && (
        <div className={styles.controlsContainer}>
          <div className={styles.filtersWrapper}>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`${styles.filterChip} ${selectedTag === tag ? styles.active : ""}`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className={styles.toggleContainer}>
            <button
              onClick={() => handleLayoutChange("grid")}
              className={`${styles.toggleBtn} ${layout === "grid" ? styles.active : ""}`}
              title="Grid view"
              aria-label="Grid view"
            >
              Grid
            </button>
            <button
              onClick={() => handleLayoutChange("list")}
              className={`${styles.toggleBtn} ${layout === "list" ? styles.active : ""}`}
              title="List view"
              aria-label="List view"
            >
              List
            </button>
          </div>
        </div>
      )}

      <div className={layout === "grid" ? styles.projectsGrid : styles.projectsList}>
        {filteredProjects.map((post) => (
          <ProjectCard
            key={post.slug}
            href={`/work/${post.slug}`}
            images={post.metadata.images}
            title={post.metadata.title}
            description={post.metadata.summary}
            content={post.content}
            avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
            link={post.metadata.link || ""}
            tags={post.metadata.tags || []}
            layout={layout}
            publishedAt={post.metadata.publishedAt}
          />
        ))}
      </div>
    </div>
  );
}
