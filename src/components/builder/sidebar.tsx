"use client";

import { useDraggable } from "@dnd-kit/core";
import { FieldType } from "@/lib/store/form-builder";
import { GripVertical, Type, Mail, Hash, GraduationCap, List, CircleDot, IndianRupee, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormBuilderStore } from "@/lib/store/form-builder";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const FIELD_TYPES: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: "TEXT", label: "Short Text", icon: <Type className="w-4 h-4" /> },
  { type: "EMAIL", label: "Email Address", icon: <Mail className="w-4 h-4" /> },
  { type: "NUMBER", label: "Number", icon: <Hash className="w-4 h-4" /> },
  { type: "BGMI_UID", label: "Student ID / Roll No", icon: <GraduationCap className="w-4 h-4" /> },
  { type: "SELECT", label: "Dropdown", icon: <List className="w-4 h-4" /> },
  { type: "RADIO", label: "Single Choice", icon: <CircleDot className="w-4 h-4" /> },
  { type: "PAYMENT", label: "Registration Fee (Razorpay)", icon: <IndianRupee className="w-4 h-4" /> },
  { type: "IMAGE", label: "Banner Image", icon: <ImageIcon className="w-4 h-4" /> },
];

function DraggableField({ type, label, icon, onClick }: { type: FieldType; label: string; icon: React.ReactNode; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: {
      type,
      isSidebarItem: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 bg-card border rounded-md cursor-grab active:cursor-grabbing hover:border-primary transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={onClick}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground" />
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function BuilderSidebar() {
  const [activeTab, setActiveTab] = useState<"elements" | "templates">("elements");
  const sections = useFormBuilderStore((state) => state.sections);
  const addField = useFormBuilderStore((state) => state.addField);
  const loadTemplate = useFormBuilderStore((state) => state.loadTemplate);

  const handleFieldClick = (type: FieldType) => {
    if (sections.length > 0) {
      addField(sections[0].id, type);
    }
  };

  const templates = [
    {
      id: "campus-fest",
      name: "College Fest & Hackathon",
      description: "Standard registration for campus competitions, hackathons, and fests",
      getTemplate: () => {
        const sectionId = uuidv4();
        return {
          title: "Campus Fest & Hackathon Registration",
          description: "Register your team or solo entry for the upcoming campus competitions.",
          sections: [
            {
              id: sectionId,
              title: "Participant & Team Details",
              fields: [
                { id: uuidv4(), type: "TEXT" as FieldType, label: "Full Name / Team Lead", required: true },
                { id: uuidv4(), type: "EMAIL" as FieldType, label: "Student Email", required: true },
                { id: uuidv4(), type: "TEXT" as FieldType, label: "WhatsApp / Contact Number", required: true },
                { id: uuidv4(), type: "TEXT" as FieldType, label: "College / University Name", required: true },
                { id: uuidv4(), type: "BGMI_UID" as FieldType, label: "Student Roll No / ID", required: true },
                { id: uuidv4(), type: "SELECT" as FieldType, label: "Year of Study", required: true, options: [{ label: "1st Year", value: "1st" }, { label: "2nd Year", value: "2nd" }, { label: "3rd Year", value: "3rd" }, { label: "4th Year / Final", value: "4th" }, { label: "Postgraduate", value: "pg" }] },
                { id: uuidv4(), type: "SELECT" as FieldType, label: "Event Track / Category", required: true, options: [{ label: "Hackathon / Coding", value: "hackathon" }, { label: "Robotics & AI", value: "robotics" }, { label: "Quiz & Debates", value: "quiz" }, { label: "Cultural & Performing Arts", value: "cultural" }] },
                { id: uuidv4(), type: "PAYMENT" as FieldType, label: "Registration Fee (INR)", required: true, options: [{ label: "Amount", value: "100" }] }
              ]
            }
          ]
        };
      }
    },
    {
      id: "club-recruitment",
      name: "Student Club Recruitment",
      description: "Application form for college societies, committees, and clubs",
      getTemplate: () => {
        const sectionId = uuidv4();
        return {
          title: "Student Club Membership Application",
          description: "Join our student-led club and lead events on campus.",
          sections: [
            {
              id: sectionId,
              title: "Applicant Information",
              fields: [
                { id: uuidv4(), type: "TEXT" as FieldType, label: "Full Name", required: true },
                { id: uuidv4(), type: "EMAIL" as FieldType, label: "College Email", required: true },
                { id: uuidv4(), type: "TEXT" as FieldType, label: "Department / Major", required: true },
                { id: uuidv4(), type: "BGMI_UID" as FieldType, label: "Roll Number / Student ID", required: true },
                { id: uuidv4(), type: "SELECT" as FieldType, label: "Preferred Department / Wing", required: true, options: [{ label: "Technical & Development", value: "tech" }, { label: "Design & Media", value: "design" }, { label: "Event Management", value: "events" }, { label: "Sponsorship & PR", value: "pr" }] },
                { id: uuidv4(), type: "TEXT" as FieldType, label: "Why do you want to join?", required: true }
              ]
            }
          ]
        };
      }
    },
    {
      id: "seminar-rsvp",
      name: "Seminar & Workshop RSVP",
      description: "Quick RSVP form for campus seminars, webinars, and guest lectures",
      getTemplate: () => {
        const sectionId = uuidv4();
        return {
          title: "Campus Seminar & Workshop RSVP",
          description: "Reserve your seat for the upcoming expert lecture and interactive session.",
          sections: [
            {
              id: sectionId,
              title: "Attendee Information",
              fields: [
                { id: uuidv4(), type: "TEXT" as FieldType, label: "Attendee Name", required: true },
                { id: uuidv4(), type: "EMAIL" as FieldType, label: "Email Address", required: true },
                { id: uuidv4(), type: "TEXT" as FieldType, label: "College / School / Organization", required: true },
                { id: uuidv4(), type: "SELECT" as FieldType, label: "Attendance Mode", required: true, options: [{ label: "In-Person (Campus Auditorium)", value: "offline" }, { label: "Online Live Stream", value: "online" }] }
              ]
            }
          ]
        };
      }
    }
  ];

  return (
    <div className="hidden md:flex w-64 border-r bg-muted/20 flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Add to Form</h3>
        <div className="flex bg-muted p-1 rounded-md">
          <button
            className={`flex-1 text-xs font-medium py-1.5 rounded-sm transition-all ${activeTab === 'elements' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('elements')}
          >
            Elements
          </button>
          <button
            className={`flex-1 text-xs font-medium py-1.5 rounded-sm transition-all ${activeTab === 'templates' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('templates')}
          >
            Templates
          </button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        {activeTab === 'elements' ? (
          <div className="flex flex-col gap-3">
            {FIELD_TYPES.map((field) => (
              <DraggableField key={field.type} {...field} onClick={() => handleFieldClick(field.type)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {templates.map(tpl => (
              <div key={tpl.id} className="border rounded-md p-3 bg-card hover:border-primary transition-colors cursor-pointer group" onClick={() => {
                if(confirm("Load template? This will replace your current form design.")) {
                  const data = tpl.getTemplate();
                  loadTemplate(data.title, data.description, data.sections);
                }
              }}>
                <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">{tpl.name}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{tpl.description}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
