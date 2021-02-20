console.log('ts')

function init() {
  const speed = document.querySelector('input#speed') as HTMLInputElement
  const double = document.querySelector('button#double') as HTMLCanvasElement
  const half = document.querySelector('button#half') as HTMLCanvasElement
  const canvas = document.querySelector('canvas#chart') as HTMLCanvasElement
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height
  const context = canvas.getContext('2d')!
  const image = context.getImageData(0, 0, canvas.width, canvas.height)
  console.log(image)
  const R = 0
  const G = 1
  const B = 2
  const A = 3

  function randomInt(n: number) {
    return Math.floor(Math.random() * n)
  }

  function init() {
    let i = 0
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        image.data[i + R] = randomInt(256)
        image.data[i + G] = randomInt(256)
        image.data[i + B] = randomInt(256)
        image.data[i + A] = 255
        i += 4
      }
    }
  }

  init()

  const RADIUS = 1
  let batch = Math.ceil(Math.sqrt(canvas.width * canvas.height))
  let generation = 0

  speed.value = batch.toString()
  speed.addEventListener('change', () => {
    batch = speed.valueAsNumber || batch
  })
  double.addEventListener('click', () => {
    batch *= 2
    speed.value = batch.toString()
  })
  half.addEventListener('click', () => {
    batch = Math.ceil(batch / 2)
    speed.value = batch.toString()
  })

  function tick() {
    for (let i = 0; i < batch; i++) {
      generation++
      const cx = randomInt(image.width)
      const cy = randomInt(image.height)
      const a = (cy * image.width + cx) * 4
      for (let dx = -RADIUS; dx <= RADIUS; dx++) {
        for (let dy = -RADIUS; dy <= RADIUS; dy++) {
          const b = ((cy + dy) * image.width + (cx + dx)) * 4
          for (let offset = 0; offset < 4; offset++) {
            const src = image.data[a + offset]
            let dest = image.data[b + offset]
            // dest = Math.round((src + dest) / 2)
            dest = src
            image.data[b + offset] = dest
          }
        }
      }
    }
    setTimeout(tick)
  }

  setTimeout(tick)

  function paint() {
    if (Math.random() < 1 / 60) {
      console.log({ generation: generation.toLocaleString() })
    }
    context.putImageData(image, 0, 0)
    requestAnimationFrame(paint)
  }

  requestAnimationFrame(paint)
}

init()
