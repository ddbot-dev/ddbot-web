"use client";

import { Thread } from "@assistant-ui/react";
import { MyRuntimeProvider } from "@/app/components/MyRuntimeProvider";
import { MarkdownText } from "@/app/components/MarkdownText";
import { useAssistantRuntime } from "@assistant-ui/react";

const MyApp = () => {
  const threadListRuntime = useAssistantRuntime().threadList;
  return (
    <div className="h-full">
      <MyRuntimeProvider>
        <Thread assistantMessage={{ components: { Text: MarkdownText } }} />
      </MyRuntimeProvider>
    </div>
  );
};

export default MyApp;
