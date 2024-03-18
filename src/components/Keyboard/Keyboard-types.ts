type TKey = 'ctrl' | 'return' | 'backspace' | 'super' | 'alt' | 'shift' | AlphaChar
type AlphaChar =
	| 'A'
	| 'B'
	| 'C'
	| 'D'
	| 'E'
	| 'F'
	| 'G'
	| 'H'
	| 'I'
	| 'J'
	| 'K'
	| 'L'
	| 'M'
	| 'N'
	| 'O'
	| 'P'
	| 'Q'
	| 'R'
	| 'S'
	| 'T'
	| 'U'
	| 'V'
	| 'W'
	| 'X'
	| 'Y'
	| 'Z'

export interface IKeyboardProps {
	className?: string
	combination: TKey[]
}
