const notes = [
  [
    "1.1",
    "Functions",
    "Each allowed input has exactly one output.",
    "Read a function rule, follow a mapping, find domain, codomain and range, and connect tables to graphs."
  ],
  [
    "1.2",
    "Composite functions",
    "For gf(x), apply f first, then g.",
    "Combine two rules, find an unknown rule, solve input-output questions and keep the correct domain."
  ],
  [
    "1.3",
    "Inverse functions",
    "An inverse undoes a rule.",
    "Reverse a mapping, find and check an inverse, and connect its domain and graph to the original function."
  ]
];
const noteMaterials = [
  {
    "opening": "Imagine a machine that gives you one result when you choose an input. A function is a rule like that. The input is also called the object. The output is called the image. We will first follow the rule with numbers, then describe it using sets and graphs.",
    "parts": [
      {
        "heading": "One input, one output",
        "body": "For every input in its domain, a function gives exactly one output. Different inputs may share an output. For example, squaring 2 and squaring −2 both give 4, but each input still has only one result.<br><br>A relation is a more general connection between two sets. The relation {(1, 3), (2, 4), (2, 5)} is not a function on {1, 2}: input 2 has two outputs. An input in the domain with no output also breaks the function rule.",
        "equation": "Input → rule → output",
        "check": {
          "question": "Which relation is a function on {1, 2}?",
          "options": [
            "{(1, 3), (2, 3)}",
            "{(1, 3), (1, 4), (2, 5)}",
            "{(1, 3)}"
          ],
          "correct": 0,
          "explanation": "Both inputs have exactly one output. Sharing output 3 is allowed."
        }
      },
      {
        "heading": "Reading the symbols",
        "body": "In f(x), f names the rule and x is the input. It means the output of f at x; it does not mean f multiplied by x. You may also see f: x ↦ 2x + 1. This describes the same rule as f(x) = 2x + 1.<br><br>To find f(3), put 3 wherever x appears. Keep brackets around a negative input: f(−2) = 2(−2) + 1 = −3. Move the slider below and watch one input-output pair move on the graph.",
        "equation": "f(3) = 2(3) + 1 = 7"
      },
      {
        "heading": "Domain, codomain and range",
        "body": "Suppose f maps A to B, where A = {1, 2, 3}, B = {2, 3, 4, 5}, and f(x) = x + 1.<br><br>The <strong>domain</strong> is A: all allowed inputs. The <strong>codomain</strong> is the target set B given in the question. The <strong>range</strong> contains only the outputs actually reached.<table><caption>Follow each input through f(x) = x + 1</caption><thead><tr><th scope=\"col\">Input x</th><th scope=\"col\">Output f(x)</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr><tr><td>2</td><td>3</td></tr><tr><td>3</td><td>4</td></tr></tbody></table>So the range is {2, 3, 4}. The unused value 5 is in the codomain, but not the range. Write each range value only once. If every element of the codomain is reached, the function is onto that codomain. Here it is not onto B, because 5 is unused.",
        "equation": "Domain = {1, 2, 3}; range = {2, 3, 4}",
        "check": {
          "question": "In this example, which set is the codomain?",
          "options": [
            "{1, 2, 3}",
            "{2, 3, 4}",
            "{2, 3, 4, 5}"
          ],
          "correct": 2,
          "explanation": "The codomain is the full target set B, including 5 even though no input reaches it."
        }
      },
      {
        "heading": "Finding an image or its object",
        "body": "Finding an image means using the input in the rule. Finding an object means working backwards from the output.<br><br>If f(x) = 3x − 4, the image of 2 is f(2) = 2. If the image is 11, solve 3x − 4 = 11. Add 4, then divide by 3 to get x = 5. Finally check: f(5) = 11.<br><br>One image can have several objects. Under f(x) = x², both 3 and −3 have image 9 if both inputs are allowed. Always check the domain.",
        "equation": "3x − 4 = 11 ⇒ x = 5"
      },
      {
        "heading": "Reading a graph",
        "body": "Each point (x, f(x)) shows an input and its output. Read an input on the horizontal axis, then move up or down to the graph to find its output.<br><br>A graph with only separate allowed inputs has separate points. For example, if the domain is {1, 2, 3}, plot only those three input-output pairs. Do not join them to suggest other inputs are allowed. If every real input in an interval is allowed, the graph can be continuous there.<br><br>For the vertical line test, imagine a vertical line at one input. If it meets the relation at two points, that input has two outputs, so the relation is not a function."
      },
      {
        "heading": "When a rule is undefined",
        "body": "A formula may not accept every real number. Division by zero is undefined. For f(x) = 3/(x − 1), input 1 is excluded because its denominator becomes zero.<br><br>For a real square root, the expression inside the root must be non-negative. In f(x) = √(x − 2), inputs must satisfy x ≥ 2. These restrictions belong to the domain; they are not extra outputs on a graph.",
        "equation": "3/(x − 1): x ≠ 1;    √(x − 2): x ≥ 2"
      },
      {
        "heading": "Absolute value",
        "body": "The absolute value |x| is the distance of x from zero. Distance cannot be negative, so |3| = 3, |−3| = 3 and |0| = 0.<br><br>For f(x) = |x| on −3 ≤ x ≤ 3, a few pairs are (−3, 3), (−1, 1), (0, 0), (1, 1), (3, 3). The points form a V shape. Its domain is [−3, 3] and its range is [0, 3]. Both endpoints are included.<br><br>Move the input below. A negative input still has one output: its positive distance from zero. If |x| = 2, the objects are x = −2 and x = 2.",
        "equation": "|x| = x when x ≥ 0;    |x| = −x when x < 0",
        "interactive": "absolute"
      },
      {
        "heading": "One-to-one, many-to-one and mapping into itself",
        "body": "A function is one-to-one when different inputs give different outputs. The rule f(x) = 2x + 1 is one-to-one on the real numbers. The rule f(x) = x² is many-to-one on the real numbers because x and −x share an output.<br><br>A function maps a set into itself when every allowed input and every resulting output belong to the same set. If A = {1, 2, 3} and f(x) = 4 − x, its outputs are 3, 2 and 1, so it maps A into itself.<br><br>This differs from a fixed point: one particular input is unchanged by the rule. For f(x) = 4 − x, solve 4 − x = x to find fixed point x = 2.",
        "equation": "A fixed point satisfies f(x) = x",
        "check": {
          "question": "Is f(x) = x² one-to-one on {−1, 0, 1}?",
          "options": [
            "Yes",
            "No"
          ],
          "correct": 1,
          "explanation": "Inputs −1 and 1 both give output 1. It is a function, but it is not one-to-one."
        }
      }
    ],
    "example": "Let A = {−2, −1, 0, 1, 2}, B = {0, 1, 2, 3, 4}, and f(x) = x². Find the range and the objects with image 4.",
    "steps": [
      "Calculate the outputs: 4, 1, 0, 1, 4.",
      "Remove repeated outputs. The range is {0, 1, 4}; the codomain remains the stated set B.",
      "Solve x² = 4. The solutions −2 and 2 both belong to A."
    ],
    "result": "The range is {0, 1, 4}. The objects with image 4 are −2 and 2. This function is many-to-one.",
    "visual": "function"
  },
  {
    "opening": "A composite function sends an input through two rules in order. Think of converting a number of items into a price, then applying a discount to that price. The output of the first rule becomes the input of the second.",
    "parts": [
      {
        "heading": "Follow the order",
        "body": "In gf(x), the input goes through f first. Its output then goes into g. The rule closest to x happens first. Writing g(f(x)) makes that order easier to see.<br><br>If f adds 2 and g multiplies by 3, input 4 becomes 6, then 18. The output of f is not the final answer; you still need to apply g.",
        "equation": "gf(x) = g(f(x))"
      },
      {
        "heading": "Keep the whole input in brackets",
        "body": "Let f(x) = 2x + 1 and g(x) = x². The input to g is now the whole expression 2x + 1, so gf(x) = (2x + 1)².<br><br>By contrast, fg(x) puts x² into f, giving 2x² + 1. Changing the order changes the rule. If expanding (2x + 1)², remember the middle term: 4x² + 4x + 1.",
        "equation": "gf(x) = (2x + 1)²;    fg(x) = 2x² + 1",
        "check": {
          "question": "For f(x) = x + 2 and g(x) = 3x, what is gf(x)?",
          "options": [
            "3x + 2",
            "3x + 6",
            "x + 6"
          ],
          "correct": 1,
          "explanation": "Apply f first, then multiply its whole output by 3: 3(x + 2) = 3x + 6."
        }
      },
      {
        "heading": "An image and its original input",
        "body": "To find gf(2), you can first calculate f(2), then apply g. With f(x) = 2x + 1 and g(x) = x², f(2) = 5 and g(5) = 25.<br><br>To find an input from the final output, form an equation. If f(x) = x + 2, g(x) = 3x and gf(x) = 21, solve 3(x + 2) = 21. Divide by 3, then subtract 2 to get x = 5. Check by following both rules.",
        "equation": "3(x + 2) = 21 ⇒ x = 5"
      },
      {
        "heading": "Finding a missing outer rule",
        "body": "Suppose f(x) = 2x + 1 and gf(x) = 6x + 4. We want the rule g that turns the whole output 2x + 1 into 6x + 4.<br><br>Rewrite the result in terms of that output: 6x + 4 = 3(2x + 1) + 1. So g multiplies its input by 3, then adds 1. Hence g(x) = 3x + 1.<br><br>To check, substitute f(x) into your g: 3(2x + 1) + 1 = 6x + 4.",
        "equation": "g(x) = 3x + 1"
      },
      {
        "heading": "Finding a missing inner rule",
        "body": "If g(x) = 3x − 2 and gf(x) = 6x + 4, the outside rule g is already known. Replace its input with f(x): 3f(x) − 2 = 6x + 4.<br><br>Add 2 to both sides, then divide every term by 3: f(x) = (6x + 6)/3 = 2x + 2. Check by putting this result back into g.",
        "equation": "3f(x) − 2 = 6x + 4 ⇒ f(x) = 2x + 2"
      },
      {
        "heading": "Check that both rules accept the input",
        "body": "An input must belong to the domain of the first rule, and its output must belong to the domain of the second.<br><br>For f(x) = x − 1 and g(x) = 1/x, gf(x) = 1/(x − 1), so x = 1 is excluded. For fg(x), g happens first, giving 1/x − 1, so x = 0 is excluded instead.<br><br>Even if an expression simplifies, keep any restrictions inherited from the original rules.",
        "equation": "gf(x): x ≠ 1;    fg(x): x ≠ 0"
      },
      {
        "heading": "Repeated functions and unchanged inputs",
        "body": "The notation f²(x) in composition means f(f(x)), not [f(x)]². If f(x) = x + 2, then f²(x) = x + 4 and f³(x) = x + 6. Repeating it n times gives fⁿ(x) = x + 2n, for a positive integer n.<br><br>If f(x) = −x, applying it twice returns the original input: f²(x) = x. Odd numbers of applications give −x; even numbers give x.<br><br>A fixed point of a composite satisfies gf(x) = x. If f(x) = x + 1 and g(x) = 2x, solve 2(x + 1) = x to get x = −2. Then f(−2) = −1 and g(−1) = −2.",
        "equation": "f²(x) = f(f(x))",
        "check": {
          "question": "If f(x) = x + 2, what is f²(3)?",
          "options": [
            "25",
            "7",
            "10"
          ],
          "correct": 1,
          "explanation": "Apply f twice: 3 becomes 5, then 7. Squaring f(3) would instead give 25."
        }
      },
      {
        "heading": "A composite rule in a real situation",
        "body": "A shop charges RM4 per notebook. Let f(n) = 4n be the total price before a discount. A promotion takes RM2 off a purchase of at least one notebook, so g(p) = p − 2 for prices p ≥ 4.<br><br>The final price is gf(n) = 4n − 2, where n is a positive whole number. For 3 notebooks, the price is RM10. If the final price is RM18, solve 4n − 2 = 18 to find 5 notebooks.<br><br>The domain matters here: a fractional or negative number of notebooks would not fit the situation.",
        "equation": "3 notebooks → RM12 → RM10"
      }
    ],
    "example": "Let f(x) = 2x + 1 and g(x) = x². Find gf(x) and gf(2).",
    "steps": [
      "Apply f first: the new input to g is 2x + 1.",
      "Since g squares its whole input, gf(x) = (2x + 1)² = 4x² + 4x + 1.",
      "At x = 2, f(2) = 5, so gf(2) = 25."
    ],
    "result": "The expression and the numerical method agree. Keep the order and substitute the whole input.",
    "visual": "composition"
  },
  {
    "opening": "An inverse sends an output back to the input that produced it. If a rule multiplies by 3 and then subtracts 5, its inverse adds 5 first, then divides by 3. Undo the operations in reverse order.",
    "parts": [
      {
        "heading": "Reverse a mapping",
        "body": "If f takes 2 to 1, its inverse takes 1 back to 2. We write f(2) = 1 and f⁻¹(1) = 2. The symbol −1 here means inverse; f⁻¹(x) is not 1/f(x).<br><br>For example, f(x) = 3x − 5 gives f(2) = 1. Reversing the calculation, (1 + 5)/3 = 2.",
        "equation": "2 → f → 1;    1 → f⁻¹ → 2"
      },
      {
        "heading": "Why one-to-one matters",
        "body": "If two inputs produce the same output, reversing the arrows would give two outputs for one input. That reverse relation would not be a function.<br><br>For f(x) = x² on all real numbers, output 4 could return either 2 or −2. Restricting the original domain to x ≥ 0 removes that ambiguity. Its range is then y ≥ 0, and its inverse is f⁻¹(x) = √x for x ≥ 0.<br><br>Here the inverse accepts the original range. A value in a larger unused codomain is not automatically a valid inverse input.",
        "equation": "Original domain ↔ inverse range",
        "check": {
          "question": "Can x² on all real inputs have an inverse function?",
          "options": [
            "Yes, the inverse is always √x",
            "No, because two different inputs can share an output"
          ],
          "correct": 1,
          "explanation": "The reverse rule cannot choose uniquely between a positive and negative input. A domain restriction can make it reversible."
        }
      },
      {
        "heading": "Finding an inverse step by step",
        "body": "For f(x) = 3x − 5, write y = 3x − 5. Swap the roles of input and output by interchanging x and y: x = 3y − 5.<br><br>Now make y the subject. Add 5: x + 5 = 3y. Divide by 3: y = (x + 5)/3. Finally write f⁻¹(x) = (x + 5)/3.<br><br>Do not simply change every sign. Reversing the order of the operations is essential.",
        "equation": "f⁻¹(x) = (x + 5)/3"
      },
      {
        "heading": "Check in both directions",
        "body": "To check an inverse, follow the two rules in each order. With f(x) = 3x − 5 and g(x) = (x + 5)/3, f(g(x)) = 3((x + 5)/3) − 5 = x. Also, g(f(x)) = ((3x − 5) + 5)/3 = x.<br><br>Both compositions return the original input on their valid domains. This is the identity function, often written I(x) = x.",
        "equation": "fg(x) = x and gf(x) = x"
      },
      {
        "heading": "Domain and range swap roles",
        "body": "The domain of an inverse is the range of the original function. The range of the inverse is the domain of the original.<br><br>Suppose f(x) = x + 3 with domain x ≥ 1. Its smallest output is 4, so its range is y ≥ 4. The inverse is f⁻¹(x) = x − 3, with domain x ≥ 4 and range y ≥ 1.<br><br>Check the endpoints as well as the formula. f⁻¹(4) = 1 is allowed, but f⁻¹(2) is outside this inverse’s stated domain.",
        "equation": "Domain of f⁻¹ = range of f",
        "check": {
          "question": "If f(x) = x + 3 has domain x ≥ 1, what is the inverse domain?",
          "options": [
            "x ≥ 1",
            "x ≥ 3",
            "x ≥ 4"
          ],
          "correct": 2,
          "explanation": "The original outputs start at 4. These become the inverse inputs."
        }
      },
      {
        "heading": "Seeing an inverse on a graph",
        "body": "Swapping input and output swaps the coordinates of every point. If (2, 5) is on f, then (5, 2) is on f⁻¹.<br><br>The two graphs are reflections in the line y = x. This line contains points with equal coordinates, such as (1, 1) and (3, 3). Move the input below to see a point and its reversed pair.<br><br>A horizontal line meeting the original graph more than once shows that an output has more than one object. That is why a one-to-one function passes the horizontal line test.",
        "equation": "(a, b) on f ↔ (b, a) on f⁻¹",
        "interactive": "inverse"
      },
      {
        "heading": "A fractional rule",
        "body": "For f(x) = (2x + 3)/(x − 1), x = 1 is excluded. Write y(x − 1) = 2x + 3. Collect the terms containing x: x(y − 2) = y + 3. Thus x = (y + 3)/(y − 2).<br><br>After exchanging input and output names, f⁻¹(x) = (x + 3)/(x − 2), where x ≠ 2. The excluded value 2 was not an output of the original rule.",
        "equation": "f⁻¹(x) = (x + 3)/(x − 2), x ≠ 2"
      },
      {
        "heading": "Recovering the original rule",
        "body": "Sometimes the inverse is given first. The inverse of the inverse is the original function. For f⁻¹(x) = (x − 4)/3, write y = (x − 4)/3, rearrange to x = 3y + 4, then swap the names to get f(x) = 3x + 4.<br><br>You can also reason with operations: f⁻¹ subtracts 4 and divides by 3, so f multiplies by 3 and adds 4.",
        "equation": "(f⁻¹)⁻¹(x) = f(x)"
      }
    ],
    "example": "Find the inverse of f(x) = 3x − 5 and use it to find the object with image 7.",
    "steps": [
      "Write y = 3x − 5. Interchange x and y: x = 3y − 5.",
      "Make y the subject: y = (x + 5)/3. So f⁻¹(x) = (x + 5)/3.",
      "Use output 7 as the inverse input: f⁻¹(7) = (7 + 5)/3 = 4. Check f(4) = 7."
    ],
    "result": "The object is 4. An inverse answers an output-to-input question; its domain must match the original range.",
    "visual": "inverse"
  }
];
const evaluationQuestions = [
  {
    "question": "A relation contains the pairs (1, 3), (2, 5), and (3, 7). Which statement is correct?",
    "options": [
      "It is a function because each input has one output.",
      "It is not a function because the outputs are different.",
      "It is not a function because there are three pairs.",
      "It is a function only if the outputs are equal."
    ],
    "correct": 0,
    "explanation": "A relation is a function when every input (the first number in each pair) is linked to one output only. Here, 1 maps to 3, 2 maps to 5, and 3 maps to 7. The outputs can be different; that is allowed. What matters is that no input is linked to two different outputs. So this relation is a function."
  },
  {
    "question": "Let f(x) = x − 1 and g(x) = x². What is fg(x)?",
    "options": [
      "(x − 1)²",
      "x² − 1",
      "x² + 1",
      "x − 1"
    ],
    "correct": 1,
    "explanation": "Here, fg(x) means f(g(x)), so apply g first. Since g(x) = x², put x² into f. The rule f(x) = x − 1 subtracts 1 from its input, so f(g(x)) = f(x²) = x² − 1. The answer (x − 1)² would come from doing f first, then g; that is the other order."
  },
  {
    "question": "If f(x) = 4x + 1, which is its inverse?",
    "options": [
      "(x + 1) / 4",
      "(x − 1) / 4",
      "4x − 1",
      "(1 − x) / 4"
    ],
    "correct": 1,
    "explanation": "An inverse undoes the original rule. Write y = 4x + 1, then swap x and y: x = 4y + 1. Now undo the steps in reverse order: subtract 1, then divide by 4. This gives y = (x − 1) / 4, so f⁻¹(x) = (x − 1) / 4. Check it: 4((x − 1) / 4) + 1 = x."
  },
  {
    "question": "Let A = {1, 2, 3}, B = {2, 3, 4, 5}, and f(x) = x + 1. Which is the range of f?",
    "options": [
      "{1, 2, 3}",
      "{2, 3, 4}",
      "{2, 3, 4, 5}",
      "{5}"
    ],
    "correct": 1,
    "explanation": "Apply the rule to the three allowed inputs: the outputs are 2, 3 and 4. B is the codomain, and its unused value 5 is not in the range."
  },
  {
    "question": "For f(x) = |x| on −3 ≤ x ≤ 3, which statement is correct?",
    "options": [
      "Its range is −3 ≤ y ≤ 3.",
      "Its range is 0 ≤ y ≤ 3.",
      "It is not a function.",
      "It is one-to-one on this domain."
    ],
    "correct": 1,
    "explanation": "Absolute value is a non-negative distance. The lowest output is 0 and the highest is 3. It remains a function even though positive and negative inputs can share an output."
  },
  {
    "question": "Let f(x) = 2x + 1 and gf(x) = 6x + 4. Find g(x).",
    "options": [
      "3x + 1",
      "3x + 4",
      "6x + 3",
      "2x + 3"
    ],
    "correct": 0,
    "explanation": "Rewrite 6x + 4 as 3(2x + 1) + 1. The outer rule triples its input and adds 1, so g(x) = 3x + 1."
  },
  {
    "question": "Let f(x) = x + 2. What does f²(3) equal when f² means f followed by f?",
    "options": [
      "25",
      "7",
      "10",
      "9"
    ],
    "correct": 1,
    "explanation": "First f(3) = 5. Then f(5) = 7. This is repeated composition, not squaring the value f(3)."
  },
  {
    "question": "Let f(x) = x + 3 with domain x ≥ 1. What is the domain of f⁻¹?",
    "options": [
      "x ≥ 1",
      "x ≥ 3",
      "x ≥ 4",
      "All real numbers"
    ],
    "correct": 2,
    "explanation": "The smallest output of f is 4. Its range x ≥ 4 becomes the inverse’s domain."
  },
  {
    "question": "A point (2, 5) lies on a one-to-one function f. Which point lies on its inverse?",
    "options": [
      "(−2, −5)",
      "(5, 2)",
      "(2, −5)",
      "(1/2, 1/5)"
    ],
    "correct": 1,
    "explanation": "An inverse reverses input and output. The coordinates swap, so (2, 5) becomes (5, 2). Geometrically, this is reflection in y = x."
  }
];
