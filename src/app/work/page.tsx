import { Column, Heading, Meta, Row, Schema, Text } from "@once-ui-system/core";
import { baseURL } from "@/resources/once-ui.config";
import { about, person, work } from "@/resources/content";
import { Projects } from "@/components/work/Projects";
import styles from "./work.module.css";

// Force hot-reload to register newly added MDX files

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function Work() {
  return (
    <Column maxWidth="m" paddingTop="24" gap="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Hero Header */}
      <Column fillWidth horizontal="center" align="center" gap="m" className={styles.heroSection}>
        <div className={styles.heroLabel}>
          <span className={styles.heroDot} />
          Portfolio
        </div>
        <Heading
          variant="display-strong-xl"
          align="center"
          wrap="balance"
          className={styles.heroHeading}
        >
          Selected Work
        </Heading>
        <Text
          variant="body-default-l"
          onBackground="neutral-weak"
          align="center"
          wrap="balance"
          className={styles.heroSub}
        >
          A curated collection of projects in AI, Machine Learning, and Software Engineering.
        </Text>
      </Column>

      <Projects />
    </Column>
  );
}
