"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductForm {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    descriptionFull: string;
    priceType: string;
    priceAmount: string;
    priceDisplay: string;
    category: string;
    status: string;
    isFeatured: boolean;
    thumbnailUrl: string;
    demoVideoUrl: string;
    features: string[];
    deliverables: string[];
}

export default function NewProductPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [product, setProduct] = useState<ProductForm>({
        name: "",
        slug: "",
        tagline: "",
        description: "",
        descriptionFull: "",
        priceType: "one_time",
        priceAmount: "",
        priceDisplay: "",
        category: "Consulting",
        status: "draft",
        isFeatured: false,
        thumbnailUrl: "",
        demoVideoUrl: "",
        features: [""],
        deliverables: [""],
    });

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    };

    const handleNameChange = (name: string) => {
        setProduct({
            ...product,
            name,
            slug: generateSlug(name),
        });
    };

    const addFeature = () => {
        setProduct({ ...product, features: [...product.features, ""] });
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...product.features];
        newFeatures[index] = value;
        setProduct({ ...product, features: newFeatures });
    };

    const removeFeature = (index: number) => {
        const newFeatures = product.features.filter((_, i) => i !== index);
        setProduct({ ...product, features: newFeatures.length ? newFeatures : [""] });
    };

    const addDeliverable = () => {
        setProduct({ ...product, deliverables: [...product.deliverables, ""] });
    };

    const updateDeliverable = (index: number, value: string) => {
        const newDeliverables = [...product.deliverables];
        newDeliverables[index] = value;
        setProduct({ ...product, deliverables: newDeliverables });
    };

    const removeDeliverable = (index: number) => {
        const newDeliverables = product.deliverables.filter((_, i) => i !== index);
        setProduct({ ...product, deliverables: newDeliverables.length ? newDeliverables : [""] });
    };

    const handleSave = () => {
        // TODO: Save to Supabase
        console.log("Saving product:", product);
        router.push("/admin/products");
    };

    const steps = [
        { id: 1, label: "Basic Info", icon: "📝" },
        { id: 2, label: "Pricing", icon: "💰" },
        { id: 3, label: "Content", icon: "📄" },
        { id: 4, label: "Media", icon: "🖼️" },
        { id: 5, label: "Review", icon: "✓" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="text-foreground-muted hover:text-primary">
                        ← Back
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Create New Product</h1>
                        <p className="text-foreground-muted">Add a new product or service offering</p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between max-w-3xl">
                {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                        <button
                            onClick={() => setStep(s.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${step === s.id
                                    ? "bg-primary text-primary-foreground"
                                    : step > s.id
                                        ? "bg-primary/20 text-primary"
                                        : "bg-background-alt text-foreground-muted"
                                }`}
                        >
                            <span>{s.icon}</span>
                            <span className="hidden sm:inline text-sm">{s.label}</span>
                        </button>
                        {i < steps.length - 1 && (
                            <div className={`w-8 h-0.5 mx-2 ${step > s.id ? "bg-primary" : "bg-border"}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="max-w-4xl">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Product Name *</label>
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary text-lg"
                                    placeholder="e.g., AI Audit"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">URL Slug</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground-muted">/products/</span>
                                    <input
                                        type="text"
                                        value={product.slug}
                                        onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                                        className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Tagline *</label>
                                <input
                                    type="text"
                                    value={product.tagline}
                                    onChange={(e) => setProduct({ ...product, tagline: e.target.value })}
                                    className="w-full h-10 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    placeholder="A short, compelling description"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                                <select
                                    value={product.category}
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                >
                                    <option value="Consulting">Consulting</option>
                                    <option value="Development">Development</option>
                                    <option value="Products">Products</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => setStep(2)} className="bg-primary text-primary-foreground">
                                    Next: Pricing →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Pricing */}
                {step === 2 && (
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Price Type</label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {[
                                        { value: "one_time", label: "One-Time", icon: "💵" },
                                        { value: "monthly", label: "Monthly", icon: "📆" },
                                        { value: "hourly", label: "Hourly", icon: "⏱️" },
                                        { value: "quote", label: "Quote", icon: "📋" },
                                        { value: "free", label: "Free", icon: "🎁" },
                                    ].map(type => (
                                        <button
                                            key={type.value}
                                            onClick={() => setProduct({ ...product, priceType: type.value })}
                                            className={`p-4 rounded-lg border text-center transition-all ${product.priceType === type.value
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border bg-background text-foreground-muted hover:border-primary/50"
                                                }`}
                                        >
                                            <span className="text-2xl block mb-1">{type.icon}</span>
                                            <span className="text-sm">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {product.priceType !== "quote" && product.priceType !== "free" && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Price Amount (USD)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted">$</span>
                                            <input
                                                type="text"
                                                value={product.priceAmount}
                                                onChange={(e) => setProduct({ ...product, priceAmount: e.target.value })}
                                                className="w-full h-12 pl-8 pr-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary text-lg"
                                                placeholder="2,500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Display Price</label>
                                        <input
                                            type="text"
                                            value={product.priceDisplay}
                                            onChange={(e) => setProduct({ ...product, priceDisplay: e.target.value })}
                                            className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary text-lg"
                                            placeholder="$2,500"
                                        />
                                        <p className="text-xs text-foreground-muted mt-1">How price appears (e.g., "$2,500", "$250/hr")</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(1)} className="border-border text-foreground-muted">
                                    ← Back
                                </Button>
                                <Button onClick={() => setStep(3)} className="bg-primary text-primary-foreground">
                                    Next: Content →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Content */}
                {step === 3 && (
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Short Description</label>
                                <textarea
                                    value={product.description}
                                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary resize-none"
                                    placeholder="A brief description for cards and previews"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Full Description (Markdown supported)</label>
                                <textarea
                                    value={product.descriptionFull}
                                    onChange={(e) => setProduct({ ...product, descriptionFull: e.target.value })}
                                    rows={10}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-mono text-sm focus:outline-none focus:border-primary resize-none"
                                    placeholder="## What's Included&#10;&#10;Detailed description of your product..."
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-foreground">Features</label>
                                    <Button variant="ghost" size="sm" onClick={addFeature} className="text-primary">
                                        + Add Feature
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {product.features.map((feature, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => updateFeature(i, e.target.value)}
                                                className="flex-1 h-10 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                                placeholder="Feature description"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFeature(i)}
                                                className="text-error"
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-foreground">Deliverables</label>
                                    <Button variant="ghost" size="sm" onClick={addDeliverable} className="text-primary">
                                        + Add Deliverable
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {product.deliverables.map((item, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => updateDeliverable(i, e.target.value)}
                                                className="flex-1 h-10 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                                placeholder="What they receive"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeDeliverable(i)}
                                                className="text-error"
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(2)} className="border-border text-foreground-muted">
                                    ← Back
                                </Button>
                                <Button onClick={() => setStep(4)} className="bg-primary text-primary-foreground">
                                    Next: Media →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Media */}
                {step === 4 && (
                    <Card className="bg-background border-border">
                        <CardHeader>
                            <CardTitle className="text-foreground">Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Cover Image</label>
                                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                    <span className="text-5xl block mb-4">📷</span>
                                    <p className="text-foreground mb-2">Drop an image or click to upload</p>
                                    <p className="text-xs text-foreground-muted">Recommended size: 1200 × 630 pixels</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Demo Video URL (optional)</label>
                                <input
                                    type="text"
                                    value={product.demoVideoUrl}
                                    onChange={(e) => setProduct({ ...product, demoVideoUrl: e.target.value })}
                                    className="w-full h-10 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                                <p className="text-xs text-foreground-muted mt-1">Supports YouTube, Vimeo, or direct video URLs</p>
                            </div>
                            <div className="flex justify-between">
                                <Button variant="outline" onClick={() => setStep(3)} className="border-border text-foreground-muted">
                                    ← Back
                                </Button>
                                <Button onClick={() => setStep(5)} className="bg-primary text-primary-foreground">
                                    Next: Review →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                    <div className="space-y-6">
                        <Card className="bg-background border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Review Your Product</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Preview */}
                                    <div>
                                        <h3 className="text-sm font-medium text-foreground-muted mb-4">PREVIEW</h3>
                                        <div className="rounded-xl border border-border overflow-hidden">
                                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-info/20 flex items-center justify-center">
                                                {product.demoVideoUrl ? (
                                                    <span className="text-4xl">🎬</span>
                                                ) : (
                                                    <span className="text-4xl">📦</span>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-foreground text-lg">
                                                    {product.name || "Product Name"}
                                                </h3>
                                                <p className="text-foreground-muted text-sm mt-1">
                                                    {product.tagline || "Your tagline here"}
                                                </p>
                                                <div className="flex items-center justify-between mt-4">
                                                    <span className="text-xl font-bold text-primary">
                                                        {product.priceDisplay || "$0"}
                                                    </span>
                                                    <span className="px-2 py-1 rounded-full bg-background-alt text-xs text-foreground-muted">
                                                        {product.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-foreground-muted mb-4">DETAILS</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between p-3 rounded-lg bg-background-alt">
                                                <span className="text-foreground-muted">Name</span>
                                                <span className="font-medium text-foreground">{product.name || "-"}</span>
                                            </div>
                                            <div className="flex justify-between p-3 rounded-lg bg-background-alt">
                                                <span className="text-foreground-muted">Slug</span>
                                                <span className="font-medium text-foreground">/products/{product.slug || "-"}</span>
                                            </div>
                                            <div className="flex justify-between p-3 rounded-lg bg-background-alt">
                                                <span className="text-foreground-muted">Price</span>
                                                <span className="font-medium text-primary">{product.priceDisplay || "-"}</span>
                                            </div>
                                            <div className="flex justify-between p-3 rounded-lg bg-background-alt">
                                                <span className="text-foreground-muted">Price Type</span>
                                                <span className="font-medium text-foreground">{product.priceType}</span>
                                            </div>
                                            <div className="flex justify-between p-3 rounded-lg bg-background-alt">
                                                <span className="text-foreground-muted">Category</span>
                                                <span className="font-medium text-foreground">{product.category}</span>
                                            </div>
                                            <div className="flex justify-between p-3 rounded-lg bg-background-alt">
                                                <span className="text-foreground-muted">Features</span>
                                                <span className="font-medium text-foreground">{product.features.filter(f => f).length}</span>
                                            </div>
                                            <div className="flex justify-between p-3 rounded-lg bg-background-alt">
                                                <span className="text-foreground-muted">Deliverables</span>
                                                <span className="font-medium text-foreground">{product.deliverables.filter(d => d).length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Publish Options */}
                        <Card className="bg-background border-border">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={product.isFeatured}
                                                onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
                                                className="rounded border-border"
                                            />
                                            <label className="text-sm text-foreground">Featured Product</label>
                                        </div>
                                        <select
                                            value={product.status}
                                            onChange={(e) => setProduct({ ...product, status: e.target.value })}
                                            className="h-10 px-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                                        >
                                            <option value="draft">Save as Draft</option>
                                            <option value="active">Publish Now</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setStep(4)} className="border-border text-foreground-muted">
                                            ← Back
                                        </Button>
                                        <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                                            {product.status === "active" ? "🚀 Publish Product" : "💾 Save Draft"}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
