"use server";

import React from "react";
import { renderToString } from "react-dom/server.browser";
import {
  getKindeRequiredCSS,
  getKindeRequiredJS,
  getKindeCSRF,
  getKindeWidget,
  getLogoUrl,
  type KindePageEvent,
} from "@kinde/infrastructure";

interface LoginHeaderProps {
  heading: string;
  description: string;
}

// Constants and reusable styles
const GRADIENTS = {
  radialMask: `
    radial-gradient(
      circle at center,
      black 0%,
      black 30%,
      transparent 70%
    )
  `,
  backgroundGrid: `
    linear-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.9) 1px, transparent 1px)
  `,
  redGrid: `
    linear-gradient(rgba(255, 99, 99, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 99, 99, 0.3) 1px, transparent 1px)
  `,
  glowEffect: `
    radial-gradient(
      circle,
      rgba(255, 99, 99, 0.08) 0%,
      rgba(255, 99, 99, 0.03) 35%,
      transparent 70%
    )
  `,
};

// Organized styles following BEM-like structure
const styles = {
  // Background elements
  authBackground: {
    root: {
      position: "absolute" as const,
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#f8f9fa",
      overflow: "hidden",
      zIndex: -1,
      pointerEvents: "none",
    },
    grid: {
      content: '""',
      position: "absolute" as const,
      inset: 0,
      // backgroundImage: GRADIENTS.backgroundGrid,
      backgroundSize: "50px 50px",
      // maskImage: GRADIENTS.radialMask,
      // WebkitMaskImage: GRADIENTS.radialMask,
      zIndex: -1,
      pointerEvents: "none",
    },
    glow: {
      content: '""',
      position: "absolute" as const,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "1600px",
      height: "1600px",
      // background: GRADIENTS.glowEffect,
      pointerEvents: "none",
      zIndex: -1,
    },
  },

  // Main container
  authContainer: {
    padding: "0.5rem 2rem 2rem",
    position: "relative" as const,
    top: "5rem",
    marginInline: "auto" as const,
    borderRadius: "1rem",
    backgroundColor: "white",
    maxWidth: "450px",
  },

  // Header elements
  authHeader: {
    root: {
      textAlign: "center" as const,
      marginBottom: "1.5rem",
    },
    logoWrapper: {
      width: "100%",
      display: "flex",
      padding: "1rem 0 2rem",
      justifyContent: "center",
      // backgroundColor: "rgba(255, 99, 99, 0.1)",
      // backgroundImage: GRADIENTS.redGrid,
      backgroundSize: "36px 36px",
      backgroundPosition: "0 24px",
      // maskImage: "radial-gradient(circle at top, black 0%, transparent 70%)",
    },
    logo: {
      width: "4rem",
      marginBottom: "1rem",
    },
    heading: {
      fontWeight: 600,
    },
  },
} as const;

// Components
const Background: React.FC = () => (
  <div style={styles.authBackground.root}>
    <div style={styles.authBackground.grid} />
    <div style={styles.authBackground.glow} />
  </div>
);

const LoginHeader: React.FC<LoginHeaderProps> = ({ heading, description }) => (
  <div style={styles.authHeader.root}>
    <div style={styles.authHeader.logoWrapper}>
      <img
        style={styles.authHeader.logo}
        src={getLogoUrl()}
        alt="Company logo"
      />
    </div>
    <h2 style={styles.authHeader.heading}>{heading}</h2>
    <p>{description}</p>
  </div>
);

const Layout: React.FC<KindePageEvent> = async ({ request, context }) => {
  return (
    <html lang={request.locale.lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex" />
        <meta name="csrf-token" content={getKindeCSRF()} />
        <title>{context.widget.content.page_title}</title>
        {getKindeRequiredCSS()}
        {getKindeRequiredJS()}
        <style>{`
          :root {
            --kinde-base-font-family: -apple-system, system-ui, BlinkMacSystemFont, Helvetica, Arial, Segoe UI, Roboto, sans-serif;
            --kinde-control-select-text-border-radius: 8px;
            --kinde-button-primary-background-color: #00a6e1;
            --kinde-button-primary-background-color-hover: #00a6e1;
            --kinde-button-primary-color: white;
            --kinde-button-border-radius: 8px;
            --kinde-button-secondary-background-color: #fff;
            --kinde-button-secondary-border-width: 1px;
            --kinde-button-secondary-border-color: #e9edec;
            --kinde-button-secondary-border-style: solid;
            --kinde-base-focus-outline-color: #00a6e1;
          }

        `}</style>
      </head>
      <body>
        <div id="root" data-roast-root="/admin">
          <Background />
          <div style={styles.authContainer}>
            <LoginHeader
              heading={context.widget.content.heading}
              description={context.widget.content.description}
            />
            <main>{getKindeWidget()}</main>
          </div>
        </div>
      </body>
    </html>
  );
};

// Page Component
export default async function Page(event: KindePageEvent): Promise<string> {
  const page = await Layout(event);
  return renderToString(page);
}
