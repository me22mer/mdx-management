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
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

interface BaseMetadataProps {
  type?: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
}

interface AdditionalFields {
  [key: string]: string | boolean | undefined;
}

type MDXMetadataProps = BaseMetadataProps & AdditionalFields;

const IconMap: { [key: string]: React.ReactNode } = {
  repository: <GitHubLogoIcon className="mr-2" />,
  url: <GlobeIcon className="mr-2" />,
  status: <UpdateIcon className="mr-2" />,
  readingTime: <ClockIcon className="mr-2" />,
  published: <ReaderIcon className="mr-2" />,
};

export function MDXMetadata(props: MDXMetadataProps) {
  const { type, title, description, publishedAt, tags, ...additionalFields } = props;

  const renderAdditionalFields = () => {
    return Object.entries(additionalFields).map(([key, value]) => {
      if (typeof value === "boolean") {
        return (
          <div key={key} className="flex items-center text-sm text-muted-foreground">
            {IconMap[key] || <QuestionMarkCircledIcon className="mr-2" />}
            {key.charAt(0).toUpperCase() + key.slice(1)}: {value ? "Yes" : "No"}
          </div>
        );
      }
      if (typeof value === "string") {
        if (key === "repository" || key === "url") {
          return (
            <Link
              key={key}
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              {IconMap[key] || <QuestionMarkCircledIcon className="mr-2" />}
              {key === "repository" ? "View Repository" : "Visit Website"}
            </Link>
          );
        }
        return (
          <div key={key} className="flex items-center text-sm text-muted-foreground">
            {IconMap[key] || <QuestionMarkCircledIcon className="mr-2" />}
            {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
          </div>
        );
      }
      return null;
    });
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

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
          {type && (
            <div className="flex items-center">
              <QuestionMarkCircledIcon className="mr-2" />
              Type: {capitalizeFirstLetter(type)}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-4 justify-between">
        {renderAdditionalFields()}
      </CardFooter>
    </Card>
  );
}