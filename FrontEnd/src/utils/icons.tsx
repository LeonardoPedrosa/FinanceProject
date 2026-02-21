import React from 'react'
import {
  Home,
  Heart,
  ShoppingCart,
  Car,
  Utensils,
  GraduationCap,
  Briefcase,
  Plane,
  Dumbbell,
  Coffee,
  BookOpen,
  Music,
  Smartphone,
  Zap,
  Gift,
  Star,
  TrendingUp,
  Stethoscope,
  Bus,
  Bike,
  Pill,
  PawPrint,
  Globe,
  Wallet,
  Building,
  Shirt,
} from 'lucide-react'
import { LucideProps } from 'lucide-react'

export const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Home,
  Heart,
  ShoppingCart,
  Car,
  Utensils,
  GraduationCap,
  Briefcase,
  Plane,
  Dumbbell,
  Coffee,
  BookOpen,
  Music,
  Smartphone,
  Zap,
  Gift,
  Star,
  TrendingUp,
  Stethoscope,
  Bus,
  Bike,
  Pill,
  PawPrint,
  Globe,
  Wallet,
  Building,
  Shirt,
}

export const ICON_NAMES = Object.keys(ICON_MAP)

interface IconProps {
  name: string
  size?: number
  color?: string
  className?: string
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color, className }) => {
  const Component = ICON_MAP[name] ?? Home
  return <Component size={size} color={color} className={className} />
}

export default Icon
