console.log('ts')

function init() {
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

  let radius = 1
  let batch = Math.ceil(Math.sqrt(canvas.width * canvas.height))
  let generation = 0

  {
    const input = document.querySelector('input#speed') as HTMLInputElement
    const control = input.parentElement!
    const double = control.querySelector('button#double') as HTMLCanvasElement
    const half = control.querySelector('button#half') as HTMLCanvasElement
    input.value = batch.toString()
    input.addEventListener('change', () => {
      batch = input.valueAsNumber || batch
    })
    double.addEventListener('click', () => {
      batch *= 2
      input.value = batch.toString()
    })
    half.addEventListener('click', () => {
      batch = Math.ceil(batch / 2)
      input.value = batch.toString()
    })
  }
  {
    const input = document.querySelector('input#size') as HTMLInputElement
    const control = input.parentElement!
    const double = control.querySelector('button#double') as HTMLCanvasElement
    const half = control.querySelector('button#half') as HTMLCanvasElement
    input.value = radius.toString()
    input.addEventListener('change', () => {
      radius = input.valueAsNumber || radius
    })
    double.addEventListener('click', () => {
      radius *= 2
      input.value = radius.toString()
    })
    half.addEventListener('click', () => {
      radius = Math.ceil(radius / 2)
      input.value = radius.toString()
    })
  }

  function tick() {
    for (let i = 0; i < batch; i++) {
      generation++
      const cx = randomInt(image.width)
      const cy = randomInt(image.height)
      const a = (cy * image.width + cx) * 4
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
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
