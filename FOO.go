package main

import "fmt"

// func main() {
// 	var i int
// 	var f float64
// 	var b bool
// 	var s string
// 	fmt.Printf("%v %v %v %q\n", i, f, b, s)
// }

func add(a, b int) int {
	sum := a + b
	return sum
}

type op func(int, int) int

func calc(fn op, a, b int) int {
	return fn(a, b)
}

func main() {
	res := calc(add, 2, 4)
	fmt.Printf("Val: %v\n", res)
}
