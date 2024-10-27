'use client'

import { useState, useEffect } from 'react'
import { Search, Star, Loader2, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import { Talent } from '@prisma/client';
import ViewProfileSheet from './_components/view-profile'

export interface TalentWithSimilarity extends Talent {
  matchScore: number;
}

export default function Component() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Talent[]>([])
  const [aiRecommendations, setAIRecommendations] = useState<TalentWithSimilarity[]>([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [roleFilter, setRoleFilter] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [allTalents, setAllTalents] = useState<Talent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllTalents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/talent/all')
        if (!response.ok) throw new Error('Failed to fetch talents')
        const talents = await response.json()
        setAllTalents(talents)
        setSearchResults(talents)
      } catch (error) {
        console.error('Error fetching talents:', error)
        setError('Failed to load talents. Please refresh the page.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllTalents()
  }, [])

  useEffect(() => {
    const filteredTalents = allTalents.filter(talent =>
      (roleFilter === 'All' || talent.title === roleFilter) &&
      (talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.education?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    setSearchResults(filteredTalents)
  }, [searchQuery, roleFilter, allTalents])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleGetAIRecommendations = async () => {
    setIsLoadingRecommendations(true)
    try {
      const res = await fetch(`/api/talent/search?q=${searchQuery}`);
      const recommendations: TalentWithSimilarity[] = (await res.json()).data;
      console.log("this is rec", recommendations);
      setAIRecommendations(recommendations)
    } catch (error) {
      console.error('Failed to fetch AI recommendations:', error)
    } finally {
      setIsLoadingRecommendations(false)
    }
  };

  useEffect(() => {
    const sortedResults = [...searchResults].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears
      return 0
    })
    setSearchResults(sortedResults)
  }, [sortBy])

  const roles = ['All', ...Array.from(new Set(allTalents.map(talent => talent.title)))]

  const TalentCard = ({ talent, isRecommendation = false }: { talent: Talent & { matchScore?: number }; isRecommendation?: boolean }) => (
    <Card className="overflow-hidden transition-all hover:shadow-md relative">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={talent.firstName} />
              <AvatarFallback>{`${talent.firstName[0]}${talent.lastName[0]}`}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{talent.firstName} {talent.lastName}</h3>
              <p className="text-sm text-muted-foreground">{talent.title} • {talent.experienceYears} years experience</p>
            </div>
          </div>
          {isRecommendation && (
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="text-yellow-400  pr-3" size={20} />   AI Recommended
            </Badge>
          )}
          {isRecommendation && (
            <Badge variant="secondary" className="ml-auto absolute top-16 right-2">
              <span className={`${talent.matchScore && talent.matchScore >= 90 ? 'text-emerald-500 animate-pulse' :
                talent.matchScore && talent.matchScore >= 80 ? 'text-green-500' :
                  talent.matchScore && talent.matchScore >= 70 ? 'text-lime-500' :
                    talent.matchScore && talent.matchScore >= 60 ? 'text-yellow-500' :
                      talent.matchScore && talent.matchScore >= 50 ? 'text-orange-500' :
                        'text-red-500'
                }`}>
                {talent.matchScore ? `${talent.matchScore}% Match` : 'No Match'}
              </span>
            </Badge>
          )}
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {talent.skills.map(skill => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <ViewProfileSheet developer={talent}>
              <Button variant="outline" className="mt-4 w-full" >
                View Profile
              </Button>
            </ViewProfileSheet>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{talent.firstName} {talent.lastName}</DialogTitle>
              <DialogDescription>{talent.title}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Avatar className="h-20 w-20 col-span-1">
                  <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={talent.firstName} />
                  <AvatarFallback>{`${talent.firstName[0]}${talent.lastName[0]}`}</AvatarFallback>
                </Avatar>
                <div className="col-span-3">
                  <h3 className="font-semibold text-lg">{talent.firstName} {talent.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{talent.title} • {talent.experienceYears} years experience</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Bio</h4>
                <p className="text-sm">{talent.bio}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map(skill => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Talent Search</h1>
        <p className="text-muted-foreground">Find the perfect talent for your next project</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
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
                <DropdownMenuItem onClick={() => setSortBy('title')}>
                  Title
                  {sortBy === 'title' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('experience')}>
                  Experience
                  {sortBy === 'experience' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Search Results</CardTitle>
            <Badge variant="secondary">{searchResults.length} talents found</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[200px] w-full" />
                ))}
              </div>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : searchResults.length === 0 ? (
              <p className="text-center text-muted-foreground md:col-span-2">No results found. Try adjusting your search or filters.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {searchResults.map(talent => (
                  <TalentCard key={talent.id} talent={talent} />
                ))}
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
                  <Skeleton key={i} className="h-[200px] w-full" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {aiRecommendations.length === 0 ? (
                  <p className="text-center text-muted-foreground md:col-span-2">Click &lsquo;Get Recommendations&apos; to see AI-suggested talents.</p>
                ) : (
                  aiRecommendations.map(talent => (
                    <TalentCard key={talent.id} talent={talent} isRecommendation={true} />
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
