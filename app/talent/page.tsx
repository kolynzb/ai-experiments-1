'use client'

import { useState, useEffect } from 'react'
import { Search, Star, Loader2, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Simulated data for demonstration
const talents = [
    { id: 1, name: 'Alice Johnson', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'CSS'], experience: 3 },
    { id: 2, name: 'Bob Smith', role: 'Backend Developer', skills: ['Node.js', 'Python', 'MongoDB'], experience: 5 },
    { id: 3, name: 'Charlie Brown', role: 'Full Stack Developer', skills: ['JavaScript', 'React', 'Express'], experience: 4 },
    { id: 4, name: 'Diana Ross', role: 'UX Designer', skills: ['Figma', 'Sketch', 'User Research'], experience: 6 },
    { id: 5, name: 'Ethan Hunt', role: 'DevOps Engineer', skills: ['Docker', 'Kubernetes', 'AWS'], experience: 7 },
]

// Simulated API call for AI recommendations
const getAIRecommendations = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 6, name: 'Fiona Apple', role: 'AI Specialist', skills: ['Machine Learning', 'Python', 'TensorFlow'], experience: 4 },
                { id: 7, name: 'George Michael', role: 'Data Scientist', skills: ['R', 'Python', 'SQL'], experience: 3 },
            ])
        }, 2000) // Simulate a 2-second delay
    })
}

export default function Component() {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState(talents)
    const [isSearching, setIsSearching] = useState(false)
    const [aiRecommendations, setAIRecommendations] = useState([])
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
    const [roleFilter, setRoleFilter] = useState('All')
    const [sortBy, setSortBy] = useState('name')

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setIsSearching(true)

        // Simulate a delay in searching
        setTimeout(() => {
            const filteredResults = talents.filter(talent =>
                (talent.name.toLowerCase().includes(query.toLowerCase()) ||
                    talent.role.toLowerCase().includes(query.toLowerCase()) ||
                    talent.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))) &&
                (roleFilter === 'All' || talent.role === roleFilter)
            )
            setSearchResults(filteredResults)
            setIsSearching(false)
        }, 500)
    }

    const handleGetAIRecommendations = async () => {
        setIsLoadingRecommendations(true)
        try {
            const recommendations = await getAIRecommendations()
            setAIRecommendations(recommendations)
        } catch (error) {
            console.error('Failed to fetch AI recommendations:', error)
        } finally {
            setIsLoadingRecommendations(false)
        }
    }

    useEffect(() => {
        handleSearch(searchQuery)
    }, [roleFilter])

    useEffect(() => {
        const sortedResults = [...searchResults].sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name)
            if (sortBy === 'experience') return b.experience - a.experience
            return 0
        })
        setSearchResults(sortedResults)
    }, [sortBy])

    const roles = ['All', ...new Set(talents.map(talent => talent.role))]

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Talent Search</h1>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search for talent..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                                {role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-[180px]">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Sort by
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortBy('name')}>
                            Name
                            {sortBy === 'name' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('experience')}>
                            Experience
                            {sortBy === 'experience' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Search Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isSearching ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {searchResults.length === 0 ? (
                                    <p className="text-center text-muted-foreground">No results found. Try adjusting your search or filters.</p>
                                ) : (
                                    searchResults.map(talent => (
                                        <div key={talent.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-muted rounded-lg">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={talent.name} />
                                                <AvatarFallback>{talent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-lg">{talent.name}</h3>
                                                <p className="text-sm text-muted-foreground">{talent.role} • {talent.experience} years experience</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {talent.skills.map(skill => (
                                                        <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <Button variant="outline" className="ml-auto">View Profile</Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center">
                            <Star className="mr-2 h-5 w-5 text-yellow-400" />
                            AI Recommendations
                        </CardTitle>
                        <Button
                            onClick={handleGetAIRecommendations}
                            disabled={isLoadingRecommendations}
                        >
                            {isLoadingRecommendations ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Get Recommendations'
                            )}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isLoadingRecommendations ? (
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {aiRecommendations.length === 0 ? (
                                    <p className="text-center text-muted-foreground">Click 'Get Recommendations' to see AI-suggested talents.</p>
                                ) : (
                                    aiRecommendations.map(talent => (
                                        <div key={talent.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-muted rounded-lg">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={talent.name} />
                                                <AvatarFallback>{talent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-lg">{talent.name}</h3>
                                                <p className="text-sm text-muted-foreground">{talent.role} • {talent.experience} years experience</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {talent.skills.map(skill => (
                                                        <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <Button variant="outline" className="ml-auto">View Profile</Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}