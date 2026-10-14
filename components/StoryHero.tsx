import React from "react";
import { Scene3D, SceneKind } from "./Scene3D";
import { Reveal } from "./motion";
export function StoryHero({
  eyebrow,
  title,
  highlight,
  text,
  kind,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  text: string;
  kind: SceneKind;
  children?: React.ReactNode;
}) {
  return (
    <section className={`story-hero story-${kind}`}>
      <Reveal className="story-copy">
        <div className="story-badge">
          <i className="live-dot" />
          {eyebrow}
        </div>
        <h1>
          {title}
          <span>{highlight}</span>
        </h1>
        <p>{text}</p>
        {children}
      </Reveal>
      <Reveal className="story-art" delay={0.08}>
        <Scene3D kind={kind} />
      </Reveal>
    </section>
  );
}
