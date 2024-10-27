'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Mail, MapPin, Clock, DollarSign, Briefcase, GraduationCap, Award } from 'lucide-react'
import { Talent } from '@prisma/client'



export default function ViewProfileSheet({ developer, children }: { developer: Talent; children?: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    return (

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-[90vw] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{developer.firstName} {developer.lastName}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Contact Information</h3>
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a href={`mailto:${developer.email}`} className="text-primary hover:underline">{developer.email}</a>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{developer.location}</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Professional Details</h3>
                        <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            <span>{developer.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{developer.experienceYears} years of experience</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span>${developer.hourlyRate}/hour</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>Availability: {developer.availability.replace('_', ' ').toLowerCase()}</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {developer.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Education & Certifications</h3>
                        <div className="flex items-center space-x-2">
                            <GraduationCap className="w-4 h-4 text-muted-foreground" />
                            <span>{developer.education}</span>
                        </div>
                        {developer.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-muted-foreground" />
                                <span>{cert}</span>
                            </div>
                        ))}
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Experience</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {developer.experience.map((exp, index) => (
                                <li key={index}>{exp}</li>
                            ))}
                        </ul>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Portfolio</h3>
                        <div className="flex items-center space-x-2">
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            <a href={developer.portfolioUrl!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {developer.portfolioUrl}
                            </a>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>

    )
}