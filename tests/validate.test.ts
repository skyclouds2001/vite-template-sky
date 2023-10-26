import { describe, expect, it } from 'vitest'
import { isValidProjectName } from './../src/validate'

describe('validate', () => {
  it('isValidProjectName', () => {
    expect(isValidProjectName('acb')).toBe(true)
    expect(isValidProjectName('a0b')).toBe(true)
    expect(isValidProjectName('102')).toBe(true)
    expect(isValidProjectName('1\\2')).toBe(false)
    expect(isValidProjectName('1/2')).toBe(false)
    expect(isValidProjectName('1:2')).toBe(false)
    expect(isValidProjectName('1*2')).toBe(false)
    expect(isValidProjectName('1?2')).toBe(false)
    expect(isValidProjectName('1"2')).toBe(false)
    expect(isValidProjectName('1<2')).toBe(false)
    expect(isValidProjectName('1>2')).toBe(false)
    expect(isValidProjectName('1|2')).toBe(false)
    expect(isValidProjectName('.01')).toBe(false)
    expect(isValidProjectName('.ab')).toBe(false)
  })
})
