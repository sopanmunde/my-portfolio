"use client";

import React from "react";
import { Icon } from "@once-ui-system/core";
import styles from "./ResumeButton.module.scss";
interface ResumeButtonProps {
  id?: string;
  href?: string;
  fileName?: string;
  label?: string;
}

export const ResumeButton: React.FC<ResumeButtonProps> = ({
  id = "download-resume",
  href = "/Sopan_Munde.pdf",
  fileName = "Sopan_Munde.pdf",
  label = "Download Resume",
}) => {
  return (
    <a
      id={id}
      href={href}
      download={fileName}
      className={styles.resumeButton}
      role="button"
      aria-label={label}
    >
      <span className={styles.iconWrapper}>
        <Icon name="download" size="m" />
      </span>
      <span className={styles.textWrapper}>
        {label}
        <span className={styles.pdfBadge}>PDF</span>
      </span>
    </a>
  );
};
