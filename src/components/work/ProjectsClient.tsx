"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLayout = localStorage.getItem("portfolio-projects-layout") as "grid" | "list";
    if (savedLayout === "grid" || savedLayout === "list") {
      setLayout(savedLayout);
    }
    // Intersection observer for stagger reveal
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLayoutChange = (newLayout: "grid" | "list") => {
    setLayout(newLayout);
    localStorage.setItem("portfolio-projects-layout", newLayout);
  };

  const allTags = ["All", ...Array.from(new Set(projects.flatMap(p => p.metadata.tags || [])))];
  const filteredProjects = selectedTag === "All"
    ? projects
    : projects.filter(p => p.metadata.tags?.includes(selectedTag));

  return (
    <div ref={containerRef} className={`${styles.projectsContainer} ${isVisible ? styles.visible : ""}`}>
      {showControls && (
        <div className={styles.controlsContainer}>
          <div className={styles.filtersWrapper}>
            <span className={styles.filterLabel}>Filter:</span>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Grid
            </button>
            <button
              onClick={() => handleLayoutChange("list")}
              className={`${styles.toggleBtn} ${layout === "list" ? styles.active : ""}`}
              title="List view"
              aria-label="List view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="18" height="3" rx="1" /><rect x="3" y="10.5" width="18" height="3" rx="1" />
                <rect x="3" y="17" width="18" height="3" rx="1" />
              </svg>
              List
            </button>
          </div>
        </div>
      )}

      <div className={layout === "grid" ? styles.projectsGrid : styles.projectsList}>
        {filteredProjects.map((post, index) => (
          <div
            key={post.slug}
            className={styles.cardReveal}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <ProjectCard
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
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className={styles.emptyState}>
          <p>No projects found for <strong>{selectedTag}</strong>.</p>
        </div>
      )}
    </div>
  );
}
