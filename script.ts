let input = document.getElementById('in') as HTMLInputElement | null
let output = document.getElementById('out') as HTMLInputElement | null

let varName = document.getElementById('var-name') as HTMLInputElement | null
let varVal = document.getElementById('var-val') as HTMLInputElement | null

let saveStart = 0
let saveEnd = 0

let Variables: { [key: string]: number } = {
  pi: Number(Math.PI.toFixed(4)),
  e: Number(Math.E.toFixed(4)),
}

let restrictDec = () => {
  if (output != null) {
    output.value = '= ' + Number(output.value).toFixed(4)
  }
}

let append = (val: any) => {
  if (input != null) {
    const startPos = input.selectionStart
    const endPos = input.selectionEnd
    const currentValue = input.value
    const newValue =
      currentValue.substring(0, Number(startPos)) +
      val +
      currentValue.substring(Number(endPos))
    input.value = newValue

    const cursorPos = startPos + val.length

    if (val.startsWith('Variables[')) {
      const varName = val.substring(10, val.length - 2)
      const varNameLength = varName.length

      input.setSelectionRange(
        cursorPos + varNameLength,
        cursorPos + varNameLength
      )
    } else {
      input.setSelectionRange(cursorPos, cursorPos)
    }

    setTimeout(() => {
      if (input != null) {
        input.focus()
        input.setSelectionRange(cursorPos, cursorPos)
      }
    }, 10)
  }
}

let clearScreen = () => {
  if (input != null && output != null) {
    input.value = output.value = ''
  }
}

function replaceAll(text: string, search: string, replacement: string): string {
  return text.split(search).join(replacement)
}

let formatInput = (str: string): string => {
  for (const v in Variables) {
    if (Variables.hasOwnProperty(v)) {
      const regex = new RegExp(v, 'g')
      str = str.replace(regex, String(Variables[v]))
    }
  }

  str = replaceAll(str, 'sin(', 'Math.sin(')
  str = replaceAll(str, 'cos(', 'Math.cos(')
  str = replaceAll(str, 'tan(', 'Math.tan(')
  str = replaceAll(str, 'sqrt(', 'Math.sqrt(')
  str = replaceAll(str, '^', '**')
  str = replaceAll(str, 'pi', 'Math.PI')
  str = replaceAll(str, 'e', 'Math.E')
  return str
}

let calculate = () => {
  if (input != null && output != null) {
    try {
      console.log(input.value)
      output.value = eval(formatInput(input.value))
      restrictDec()
    } catch (e: any) {
      output.value = e.message
    }
  }
}

let toRad = (deg: any) => {
  return deg * (Math.PI / 180)
}

let addVar = () => {
  let varSec = document.getElementById('var-sec')

  if (varName != null && varVal != null && varSec != null) {
    const name = varName.value.trim()
    const value = Number(varVal.value.trim())

    if (name !== '' && !isNaN(value)) {
      if (!Variables.hasOwnProperty(name)) {
        let btn = document.createElement('button')

        Variables[name] = value

        btn.textContent = `${name}`
        btn.onclick = () => {
          append(name)
        }
        btn.className = 'expr'
        varSec.appendChild(btn)

        varName.value = ''
        varVal.value = ''
      } else {
        alert('Variable with the same name already exists.')
      }
    } else {
      alert('Please enter a valid variable name and value.')
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (input != null && output != null) {
    const key = e.key
    if (key === 'Enter') {
      e.preventDefault()
      calculate()
    } else if (key === 'c' || key === 'C') {
      clearScreen()
    } else if (key === 'BackSpace') {
      e.preventDefault()
      input.value = input.value.slice(0, -1)
    } //  else {
    //   const validChar = '0123456789.+-*/^()'
    //   if (validChar.includes(key)) {
    //     append(key)
    //   }
    // }
  }
})
