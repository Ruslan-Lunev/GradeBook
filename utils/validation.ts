export const isAlpha = function (value: string): boolean {
    let str = value as string
    return /^[A-Z]+$/i.test(str)
}

export const isAlphaWhite = function (value: string): boolean {
    value = value.trim()
    return /^[A-Z\s]+$/i.test(value)
}

export const isLength = function (value: string, min?: number, max?: number): boolean {
    if (value === undefined) return false
    if (min && value.length < min) return false
    if (max && value.length > max) return false
    return true
}

export const isRange = function (value: number, min: number, max: number): boolean {
    return value >= min && value <= max
}

export const isEmail = function (value: string): boolean {
    let str = value as string
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(str)
}