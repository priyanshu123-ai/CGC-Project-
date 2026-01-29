import { Leaf } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-[rgba(37,58,52,0.5)] py-12">
              <div className="mx-auto max-w-7xl px-4">
                <div className="flex flex-col items-center justify-between gap-4">
                  {/* Logo */}
                  <div className="flex items-center gap-2">
                    <div
                      className="
                flex h-8 w-8 items-center justify-center
                rounded-lg
                bg-gradient-to-br from-[#1db954] to-[#1fa8a1]
              "
                    >
                      <Leaf className="h-6 w-6 text-[#080d0b]" />
                    </div>
    
                    <span
                      className="
                font-['Space_Grotesk']
                font-bold
                text-4xl
                bg-gradient-to-br
                from-[#1db954] via-[#1fa8a1] to-[#199fe6]
                bg-clip-text text-transparent
              "
                    >
                      EcoSense
                    </span>
                  </div>
    
                  {/* Copyright */}
                  <p className="text-sm text-[#6b7c75] text-center">
                    © 2024 EcoSense. Building a sustainable future, one score at a
                    time.
                  </p>
                </div>
              </div>
            </footer>
  )
}

export default Footer