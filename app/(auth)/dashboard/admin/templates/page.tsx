"use client";

import { useState } from "react";
import { createFormTemplate } from "@/services/admin.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// --- PREDEFINED MEDICAL SECTIONS ---
const PREDEFINED_SECTIONS = [
    {
        name: "Checkup Date Fields",
        fields: [
            { id: "date_examination", label: "Date of Examination", type: "DATE", isRequired: true, options: "" },
            { id: "checkup_number", label: "Checkup Number", type: "RADIO", isRequired: true, options: "1st Checkup,2nd Checkup" }
        ]
    },
    {
        name: "General Examination",
        fields: [
            { id: "gen_height", label: "Height (cm)", type: "NUMBER", isRequired: false, options: "" },
            { id: "gen_weight", label: "Weight (kg)", type: "NUMBER", isRequired: false, options: "" }
        ]
    },
    {
        name: "Vitals",
        fields: [
            { id: "vital_bp", label: "Blood Pressure (mmHg)", type: "TEXT", isRequired: false, options: "" },
            { id: "vital_pulse", label: "Pulse Rate (bpm)", type: "NUMBER", isRequired: false, options: "" },
            { id: "vital_temp", label: "Temperature (°F)", type: "NUMBER", isRequired: false, options: "" },
            { id: "vital_spo2", label: "SpO2 (%)", type: "NUMBER", isRequired: false, options: "" }
        ]
    },
    {
        name: "Health Conditions",
        fields: [
            { id: "cond_anaemia", label: "Anaemia", type: "CHECKBOX", isRequired: false, options: "Yes, No" },
            { id: "cond_skin", label: "Skin, Nails & Hair", type: "TEXT", isRequired: false, options: "" }
        ]
    },
    {
        name: "Eyes (Vision)",
        fields: [
            { id: "eye_right", label: "Right Eye", type: "TEXT", isRequired: false, options: "" },
            { id: "eye_left", label: "Left Eye", type: "TEXT", isRequired: false, options: "" }
        ]
    },
    {
        name: "ENT (Ear, Nose, Throat)",
        fields: [
            { id: "ent_ear", label: "Ear", type: "TEXT", isRequired: false, options: "" },
            { id: "ent_nose", label: "Nose", type: "TEXT", isRequired: false, options: "" },
            { id: "ent_throat", label: "Throat", type: "TEXT", isRequired: false, options: "" }
        ]
    },
    {
        name: "Dental",
        fields: [
            { id: "dental_teethgums", label: "Teeth & Gums", type: "TEXT", isRequired: false, options: "" }
        ]
    },
    {
        name: "Body Examination",
        fields: [
            { id: "body_systemic", label: "Systemic Examination", type: "TEXT", isRequired: false, options: "" },
            { id: "body_locomotor", label: "Locomotor System", type: "TEXT", isRequired: false, options: "" },
            { id: "body_abdomen", label: "Abdomen", type: "TEXT", isRequired: false, options: "" },
            { id: "body_respiratory", label: "Respiratory System", type: "TEXT", isRequired: false, options: "" },
            { id: "body_cvs", label: "Cardiovascular System", type: "TEXT", isRequired: false, options: "" },
            { id: "body_cns", label: "Central Nervous System", type: "TEXT", isRequired: false, options: "" },
            { id: "body_others", label: "Others", type: "TEXT", isRequired: false, options: "" }
        ]
    },
    {
        name: "Final Notes",
        fields: [
            { id: "notes_doctor", label: "Doctor's Remarks", type: "TEXT", isRequired: false, options: "" },
            { id: "notes_prescription", label: "Prescription / Advice", type: "TEXT", isRequired: false, options: "" }
        ]
    }
];

export default function TemplateBuilder() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Track which predefined fields are selected by their string ID
    const [selectedPresets, setSelectedPresets] = useState<Set<string>>(new Set());

    // Track which predefined fields have their required status checked
    const [requiredPresets, setRequiredPresets] = useState<Set<string>>(() => {
        const initial = new Set<string>();
        PREDEFINED_SECTIONS.forEach(sec => {
            sec.fields.forEach(f => {
                if (f.isRequired) initial.add(f.id);
            });
        });
        return initial;
    });

    // Tracking custom sections (for non-standard bespoke fields)
    const [customSections, setCustomSections] = useState<any[]>([]);

    const togglePreset = (fieldId: string) => {
        const next = new Set(selectedPresets);
        if (next.has(fieldId)) {
            next.delete(fieldId);
        } else {
            next.add(fieldId);
        }
        setSelectedPresets(next);
    };

    const toggleRequiredPreset = (fieldId: string) => {
        const next = new Set(requiredPresets);
        if (next.has(fieldId)) {
            next.delete(fieldId);
        } else {
            next.add(fieldId);
        }
        setRequiredPresets(next);
    };

    const toggleSectionPresets = (section: any) => {
        const allChecked = section.fields.every((f: any) => selectedPresets.has(f.id));
        const next = new Set(selectedPresets);
        if (allChecked) {
            section.fields.forEach((f: any) => next.delete(f.id));
        } else {
            section.fields.forEach((f: any) => next.add(f.id));
        }
        setSelectedPresets(next);
    };

    // --- Custom Section Logic (Bottom of page logic) ---
    const addCustomSection = () => {
        setCustomSections([...customSections, { id: Date.now(), name: "", fields: [] }]);
    };
    const addCustomField = (sectionIndex: number) => {
        const newSections = [...customSections];
        newSections[sectionIndex].fields.push({
            id: Date.now(), name: "", label: "", type: "TEXT", isRequired: false, options: ""
        });
        setCustomSections(newSections);
    };
    const updateCustomField = (sIdx: number, fIdx: number, key: string, value: any) => {
        const newSections = [...customSections];
        newSections[sIdx].fields[fIdx][key] = value;
        setCustomSections(newSections);
    }
    const removeCustomField = (sIdx: number, fIdx: number) => {
        const newSections = [...customSections];
        newSections[sIdx].fields.splice(fIdx, 1);
        setCustomSections(newSections);
    }
    const removeCustomSection = (sIdx: number) => {
        setCustomSections(customSections.filter((_, i) => i !== sIdx));
    }


    const handleSave = async () => {
        setSaving(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);

        // 1. Reconstruct logical sections from selected presets
        const activeSections: any[] = [];

        PREDEFINED_SECTIONS.forEach(presetSec => {
            const activeFields = presetSec.fields.filter(f => selectedPresets.has(f.id)).map(f => ({
                name: f.id,
                label: f.label,
                type: f.type,
                isRequired: requiredPresets.has(f.id),
                options: f.options ? f.options.split(',').map((o: string) => o.trim()) : null
            }));

            if (activeFields.length > 0) {
                activeSections.push({
                    name: presetSec.name,
                    fields: activeFields
                });
            }
        });

        // 2. Append Custom Sections
        const formattedCustom = customSections.map(s => ({
            name: s.name || "Custom Section",
            fields: s.fields.map((f: any) => ({
                name: f.name || f.label.replace(/\s+/g, '_').toLowerCase(),
                label: f.label,
                type: f.type,
                isRequired: f.isRequired,
                options: f.options ? f.options.split(',').map((o: string) => o.trim()) : null
            }))
        }));

        const finalSections = [...activeSections, ...formattedCustom];

        formData.append("sections", JSON.stringify(finalSections));
        const res = await createFormTemplate(formData);

        setSaving(false);
        if (res.success) {
            router.push("/dashboard/admin");
        } else if (res.error) {
            setError(res.error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight  text-blue-900">Form Template Builder</h1>
                <p className="text-slate-500">Quickly build structured health camp forms by selecting predefined medical fields.</p>
            </div>

            <Card className="shadow-sm border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 md:p-8">
                    <CardTitle className="text-xl font-bold  flex items-center gap-2">
                        <span className="p-2 bg-white/20 rounded-lg">📋</span>
                        Template Details
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-sm mt-1">
                        Define the basic parameters of your form template.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 p-6 md:p-8 bg-slate-50 dark:bg-slate-950">
                    <div className="space-y-2.5">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Template Name *</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Standard Winter Health Checkup v1" className="h-11 rounded-xl bg-white focus-visible:ring-blue-500 shadow-sm" />
                    </div>
                    <div className="space-y-2.5">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</Label>
                        <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="General health camp screening for K-12 students" className="h-11 rounded-xl bg-white focus-visible:ring-blue-500 shadow-sm" />
                    </div>
                </CardContent>
            </Card>

            {error && (
                <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-md text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Predefined Medical Fields</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PREDEFINED_SECTIONS.map((section, idx) => {
                        const allChecked = section.fields.every(f => selectedPresets.has(f.id));
                        return (
                            <Card key={idx} className="shadow-sm border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between">
                                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{section.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => toggleSectionPresets(section)}
                                        className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-sm text-blue-600 hover:text-blue-800 hover:bg-slate-50 transition-colors"
                                    >
                                        {allChecked ? "Deselect All" : "Select All"}
                                    </button>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3 bg-white dark:bg-slate-900">
                                    {section.fields.map(field => (
                                        <label key={field.id} className="flex items-start space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <input
                                                type="checkbox"
                                                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 pointer-events-none"
                                                checked={selectedPresets.has(field.id)}
                                                onChange={() => togglePreset(field.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="flex flex-col flex-1">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{field.label}</span>
                                                <span className="text-[10px] text-slate-400 capitalize mt-0.5">
                                                    {field.type.toLowerCase()}
                                                </span>
                                            </div>

                                            {selectedPresets.has(field.id) && (
                                                <label className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 ml-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded shadow-sm z-10 transition-colors" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        className="w-3 h-3 text-red-500 rounded border-slate-300 focus:ring-red-500"
                                                        checked={requiredPresets.has(field.id)}
                                                        onChange={() => toggleRequiredPreset(field.id)}
                                                    />
                                                    Required
                                                </label>
                                            )}
                                        </label>
                                    ))}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-4 pt-10 border-t">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Custom Form Sections (Optional)</h2>
                        <p className="text-xs text-slate-500">Need a bespoke field? Add it manually here.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={addCustomSection}>+ Add Custom Section</Button>
                </div>

                <div className="space-y-6">
                    {customSections.map((section, sIdx) => (
                        <Card key={section.id} className="border-indigo-100 dark:border-indigo-900/40 shadow-sm transition-all rounded-xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 flex flex-col sm:flex-row items-center justify-between pb-4 pt-4 border-b border-indigo-100 dark:border-indigo-900/40">
                                <div className="w-full sm:w-1/2 mb-3 sm:mb-0">
                                    <Input
                                        className="font-bold text-lg bg-white"
                                        value={section.name}
                                        onChange={(e) => {
                                            const n = [...customSections];
                                            n[sIdx].name = e.target.value;
                                            setCustomSections(n);
                                        }}
                                        placeholder="Custom Section Name"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-700" onClick={() => addCustomField(sIdx)}>+ Add Field</Button>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-100/80" onClick={() => removeCustomSection(sIdx)}>Delete Section</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {section.fields.length === 0 && (
                                    <p className="text-center text-sm text-slate-400 py-4">No custom fields added. Predefined fields are already handled above.</p>
                                )}
                                {section.fields.map((field: any, fIdx: number) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-4 items-start p-4 border rounded-md relative bg-white">
                                        <button onClick={() => removeCustomField(sIdx, fIdx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs">✕</button>

                                        <div className="col-span-12 md:col-span-4 space-y-1">
                                            <Label className="text-xs">Field Label</Label>
                                            <Input value={field.label} onChange={(e) => updateCustomField(sIdx, fIdx, 'label', e.target.value)} placeholder="e.g. Pupil Dilation Scale" className="h-8 text-sm" />
                                        </div>
                                        <div className="col-span-6 md:col-span-3 space-y-1">
                                            <Label className="text-xs">Type</Label>
                                            <select
                                                value={field.type}
                                                onChange={(e) => updateCustomField(sIdx, fIdx, 'type', e.target.value)}
                                                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                                            >
                                                <option value="TEXT">Text</option>
                                                <option value="NUMBER">Number</option>
                                                <option value="DROPDOWN">Dropdown</option>
                                                <option value="RADIO">Radio</option>
                                                <option value="CHECKBOX">Checkbox</option>
                                                <option value="DATE">Date</option>
                                            </select>
                                        </div>
                                        <div className="col-span-6 md:col-span-2 space-y-1 flex flex-col justify-end h-full mt-5">
                                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                <input type="checkbox" checked={field.isRequired} onChange={(e) => updateCustomField(sIdx, fIdx, 'isRequired', e.target.checked)} />
                                                Required
                                            </label>
                                        </div>

                                        {(field.type === 'DROPDOWN' || field.type === 'RADIO' || field.type === 'CHECKBOX') && (
                                            <div className="col-span-12 space-y-1 pt-2 border-t mt-2 border-dashed">
                                                <Label className="text-xs">Options (Comma separated)</Label>
                                                <Input value={field.options} onChange={(e) => updateCustomField(sIdx, fIdx, 'options', e.target.value)} placeholder="e.g. High, Medium, Low" className="h-8 text-sm" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="flex justify-between pt-8 border-t mb-20">
                <p className="text-sm text-slate-500 max-w-sm">When you save, the system will stitch together your checked presets and any custom sections into a unified form schema.</p>
                <Button className="bg-blue-600 hover:bg-blue-700 w-48 h-12 text-md shadow-lg" onClick={handleSave} disabled={saving || !name || (selectedPresets.size === 0 && customSections.length === 0)}>
                    {saving ? "Creating Template..." : "Save Template"}
                </Button>
            </div>
        </div>
    );
}
