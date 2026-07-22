"use client";

import React from "react";
import { FileStack } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { Section } from "@/shared/components/layout/Section";
import { UploadCenter } from "@/features/documents/components/UploadCenter";
import { DocumentProcessingPipeline } from "@/features/documents/components/pipeline/DocumentProcessingPipeline";

export default function DocumentsPage() {
  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]">
      {/* Sticky Workspace Header */}
      <WorkspaceHeader
        title="Document Intelligence Workspace"
        subtitle="Upload, classify, extract, validate, and ingest financial documents through the enterprise processing pipeline."
        icon={<FileStack className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
        bordered={true}
        className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]"
      />

      {/* Independent scrolling content */}
      <PageContainer
        scrollable={true}
        padded={true}
        className="flex-1 min-h-0 pb-16 gap-10 flex flex-col"
        aria-label="Document Intelligence workspace"
      >
        {/* Upload Center */}
        <Section title="Upload Center" compact className="max-w-3xl">
          <UploadCenter />
        </Section>

        {/* Enterprise Processing Pipeline */}
        <DocumentProcessingPipeline />
      </PageContainer>
    </div>
  );
}
