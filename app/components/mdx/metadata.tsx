"use client";

import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  CalendarIcon,
  GitHubLogoIcon,
  GlobeIcon,
  UpdateIcon,
  ClockIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

interface BaseMetadataProps {
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
}

interface ProjectMetadataProps extends BaseMetadataProps {
  type: "project";
  repository?: string;
  url?: string;
  status?: string;
}

interface BlogMetadataProps extends BaseMetadataProps {
  type: "blog";
  published?: boolean;
  readingTime?: string;
}

type MDXMetadataProps = ProjectMetadataProps | BlogMetadataProps;

export function MDXMetadata(props: MDXMetadataProps) {
  const { title, description, publishedAt, tags } = props;

  return (
    <Card className="w-full max-w-3xl mx-auto mb-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <CalendarIcon className="mr-2" />
            Published: {publishedAt}
          </div>
          {props.type === "project" && (
            <div className="flex items-center">
              <UpdateIcon className="mr-2" />
              Status: {props.status}
            </div>
          )}
          {props.type === "blog" && (
            <div className="flex items-center">
              <ClockIcon className="mr-2" />
              Reading Time: {props.readingTime}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {props.type === "project" && (
          <>
            {props.repository && (
              <Link
                href={props.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <GitHubLogoIcon className="mr-2" />
                View Repository
              </Link>
            )}
            {props.url && (
              <Link
                href={props.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <GlobeIcon className="mr-2" />
                Visit Website
              </Link>
            )}
          </>
        )}
        {props.type === "blog" && (
          <div className="flex items-center text-sm text-muted-foreground">
            <ReaderIcon className="mr-2" />
            {props.published ? "Published" : "Draft"} Blog Post
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
