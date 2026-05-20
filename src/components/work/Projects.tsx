import { getPosts } from "@/utils/utils";
import { ProjectsClient } from "./ProjectsClient";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
}

export function Projects({ range, exclude }: ProjectsProps) {
  let allProjects = getPosts(["src", "app", "work", "projects"]);

  // Exclude by slug (exact match)
  if (exclude && exclude.length > 0) {
    allProjects = allProjects.filter((post) => !exclude.includes(post.slug));
  }

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  // Map to a clean object to avoid non-serializable elements
  const serializedProjects = displayedProjects.map(project => ({
    slug: project.slug,
    content: project.content,
    metadata: {
      title: project.metadata.title,
      publishedAt: project.metadata.publishedAt,
      summary: project.metadata.summary,
      image: project.metadata.image,
      images: project.metadata.images,
      tag: project.metadata.tag,
      tags: project.metadata.tags || [],
      team: project.metadata.team || [],
      link: project.metadata.link,
    }
  }));

  return (
    <ProjectsClient 
      projects={serializedProjects} 
      showControls={!range}
    />
  );
}
