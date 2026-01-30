"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StepErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class StepErrorBoundary extends React.Component<
    { children: React.ReactNode },
    StepErrorBoundaryState
> {
    state: StepErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): StepErrorBoundaryState {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <Card className="max-w-2xl mx-auto mt-16">
                    <CardHeader>
                        <CardTitle className="text-error">Something went wrong</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-foreground-muted">
                            {this.state.error?.message || "Unexpected error. Please reload and try again."}
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Reload page
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}
