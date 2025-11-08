'use client'

import { useState, useEffect } from 'react'
import { ProjectWithTeams } from '@/types/team'

// Simple project state management for navigation
let selectedProject: ProjectWithTeams | null = null
let listeners: ((project: ProjectWithTeams | null) => void)[] = []

export function useSelectedProject() {
  const [project, setProject] = useState<ProjectWithTeams | null>(selectedProject)

  useEffect(() => {
    const listener = (newProject: ProjectWithTeams | null) => {
      setProject(newProject)
    }
    
    listeners.push(listener)
    
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  const setSelectedProject = (newProject: ProjectWithTeams | null) => {
    selectedProject = newProject
    listeners.forEach(listener => listener(newProject))
    
    // Store in localStorage for persistence
    if (newProject) {
      localStorage.setItem('selectedProjectId', newProject.id)
    } else {
      localStorage.removeItem('selectedProjectId')
    }
  }

  // Load from localStorage on initial mount
  useEffect(() => {
    const storedProjectId = localStorage.getItem('selectedProjectId')
    if (storedProjectId && !selectedProject) {
      // Note: In a real app, you'd fetch the project data here
      // For now, we'll let the ProjectSelector handle the loading
    }
  }, [])

  return {
    selectedProject: project,
    setSelectedProject
  }
}