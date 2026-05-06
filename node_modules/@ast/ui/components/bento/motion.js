/**
 * Motion variants for AST Studio components
 * Pure CSS animations without external libraries
 */

export const fadeIn = {
  initial: {
    opacity: 0,
    transform: 'translateY(10px)'
  },
  animate: {
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'all 0.6s ease-out'
  }
}

export const pop = {
  initial: {
    transform: 'scale(0.95)',
    opacity: 0
  },
  animate: {
    transform: 'scale(1)',
    opacity: 1,
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out'
  }
}

export const glowPulse = {
  keyframes: `
    @keyframes glowPulse {
      0%, 100% {
        box-shadow: 0 0 20px rgba(254, 95, 167, 0.3), 0 0 40px rgba(38, 54, 224, 0.1);
      }
      50% {
        box-shadow: 0 0 30px rgba(254, 95, 167, 0.6), 0 0 60px rgba(38, 54, 224, 0.3);
      }
    }
  `,
  animation: 'glowPulse 3s ease-in-out infinite'
}

export const slideInUp = {
  initial: {
    opacity: 0,
    transform: 'translateY(20px)'
  },
  animate: {
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'all 0.5s ease-out'
  }
}

export const slideInLeft = {
  initial: {
    opacity: 0,
    transform: 'translateX(-20px)'
  },
  animate: {
    opacity: 1,
    transform: 'translateX(0)',
    transition: 'all 0.5s ease-out'
  }
}

export default {
  fadeIn,
  pop,
  glowPulse,
  slideInUp,
  slideInLeft
}
