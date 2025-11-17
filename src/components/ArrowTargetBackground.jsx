import { useEffect, useRef } from 'react'

// Canvas-based subtle background animation with tiny arrows and targets
// - Small elements only, low density to keep UI clean
// - Some arrows hit targets (both vanish), some miss (arrow fades out)
// - Soft blue glows on a premium dark gradient backdrop

export default function ArrowTargetBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * DPR
    canvas.height = height * DPR
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(DPR, DPR)

    const arrows = []
    const targets = []

    const MAX_ARROWS = 10
    const MAX_TARGETS = 8

    function rand(min, max) {
      return Math.random() * (max - min) + min
    }

    function spawnTarget() {
      const r = rand(4, 8) // small
      targets.push({
        x: rand(0, width),
        y: rand(0, height),
        r,
        life: rand(5, 10), // seconds
        born: performance.now() / 1000,
        glow: rand(0.2, 0.6),
      })
    }

    function spawnArrow() {
      // Spawn from left or right edges headed across, or top/bottom occasionally
      const edge = Math.floor(rand(0, 4)) // 0=left,1=right,2=top,3=bottom
      let x, y, vx, vy
      const speed = rand(60, 120) // px/s
      const angleJitter = rand(-0.25, 0.25)
      if (edge === 0) {
        x = -10
        y = rand(0, height)
        vx = speed
        vy = speed * angleJitter
      } else if (edge === 1) {
        x = width + 10
        y = rand(0, height)
        vx = -speed
        vy = speed * angleJitter
      } else if (edge === 2) {
        x = rand(0, width)
        y = -10
        vx = speed * angleJitter
        vy = speed
      } else {
        x = rand(0, width)
        y = height + 10
        vx = speed * angleJitter
        vy = -speed
      }
      arrows.push({
        x,
        y,
        vx,
        vy,
        len: rand(10, 16),
        width: rand(1.2, 1.8),
        born: performance.now() / 1000,
        life: rand(3.5, 6),
        // fade for misses
        fade: 0,
      })
    }

    // Ensure some initial population
    for (let i = 0; i < MAX_TARGETS / 2; i++) spawnTarget()

    let last = performance.now() / 1000

    function drawTarget(t) {
      const { x, y, r, glow } = t
      // soft concentric target
      ctx.save()
      ctx.translate(x, y)
      ctx.globalAlpha = 0.5
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 3)
      gradient.addColorStop(0, 'rgba(59,130,246,0.25)') // blue-500
      gradient.addColorStop(1, 'rgba(59,130,246,0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(0, 0, r * 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = 0.8
      ctx.strokeStyle = `rgba(255,255,255,${0.5 + glow * 0.3})`
      ctx.lineWidth = 1

      for (let i = 1; i <= 3; i++) {
        ctx.beginPath()
        ctx.arc(0, 0, (r / 2) * i, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.restore()
    }

    function drawArrow(a) {
      const { x, y, vx, vy, len, width } = a
      const ang = Math.atan2(vy, vx)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(ang)

      // trail glow
      const trail = ctx.createLinearGradient(-len * 1.5, 0, len, 0)
      trail.addColorStop(0, 'rgba(59,130,246,0)')
      trail.addColorStop(1, 'rgba(59,130,246,0.35)')
      ctx.strokeStyle = trail
      ctx.lineWidth = Math.max(width - 0.5, 0.8)
      ctx.beginPath()
      ctx.moveTo(-len * 1.5, 0)
      ctx.lineTo(len * 0.2, 0)
      ctx.stroke()

      // shaft
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(len, 0)
      ctx.stroke()

      // head
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.beginPath()
      ctx.moveTo(len, 0)
      ctx.lineTo(len - 4, 2.2)
      ctx.lineTo(len - 4, -2.2)
      ctx.closePath()
      ctx.fill()

      // fletching
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-3.5, 1.8)
      ctx.lineTo(-3.5, -1.8)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }

    function update(dt) {
      // Maintain population slowly
      if (targets.length < MAX_TARGETS && Math.random() < 0.02) spawnTarget()
      if (arrows.length < MAX_ARROWS && Math.random() < 0.06) spawnArrow()

      // Update arrows
      for (let i = arrows.length - 1; i >= 0; i--) {
        const a = arrows[i]
        a.x += a.vx * dt
        a.y += a.vy * dt

        // life fade for misses
        const age = performance.now() / 1000 - a.born
        if (age > a.life) {
          a.fade += dt
          if (a.fade > 0.4) arrows.splice(i, 1)
        }

        // out of bounds -> disappear (miss)
        if (a.x < -20 || a.x > width + 20 || a.y < -20 || a.y > height + 20) {
          arrows.splice(i, 1)
        }
      }

      // Update targets lifetimes
      for (let i = targets.length - 1; i >= 0; i--) {
        const t = targets[i]
        const age = performance.now() / 1000 - t.born
        if (age > t.life) targets.splice(i, 1)
      }

      // Collision detection (hit -> remove both)
      for (let i = arrows.length - 1; i >= 0; i--) {
        const a = arrows[i]
        for (let j = targets.length - 1; j >= 0; j--) {
          const t = targets[j]
          const dx = a.x - t.x
          const dy = a.y - t.y
          const dist2 = dx * dx + dy * dy
          const hitR = t.r + 4
          if (dist2 < hitR * hitR) {
            arrows.splice(i, 1)
            targets.splice(j, 1)
            break
          }
        }
      }
    }

    function clear() {
      // premium dark gradient background pass
      const g = ctx.createLinearGradient(0, 0, width, height)
      g.addColorStop(0, '#0b0f17')
      g.addColorStop(1, '#0a0c12')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      // subtle vignette
      const vg = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.2, width / 2, height / 2, Math.max(width, height) * 0.8)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.6)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, width, height)
    }

    function render() {
      clear()
      // glow layer for targets first
      targets.forEach(drawTarget)

      // arrows
      arrows.forEach(drawArrow)
    }

    function loop() {
      const now = performance.now() / 1000
      const dt = Math.min(now - last, 0.033)
      last = now
      update(dt)
      render()
      animationRef.current = requestAnimationFrame(loop)
    }

    loop()

    function onResize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * DPR
      canvas.height = height * DPR
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(DPR, DPR)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 block"
    />
  )
}
