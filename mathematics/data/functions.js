    const form4=["Functions","Quadratic Functions","Systems of Equations","Indices, Surds and Logarithms","Progressions","Linear Law","Coordinate Geometry","Vectors","Solution of Triangles","Index Number"];
    const form5=["Circular Measure","Differentiation","Integration","Permutation and Combination","Probability Distribution","Trigonometric Functions","Linear Programming","Kinematics of Linear Motion"];
    const practiceQuestionBanks=[
      [
        {id:"functions-v2-range",subtopic:0,context:"A function f maps each element of set A to exactly one value in set B.",rule:"A = {-2,-1,0,1,2}, B = {0,1,4}, and f(x) = x².",ask:"State the range of f.",worked:"Evaluate f(x) for every x in A. The outputs are 4, 1, 0, 1 and 4, so the range is {0, 1, 4}.",answers:["{0,1,4}","0,1,4"]},
        {id:"functions-v2-domain",subtopic:0,context:"The function f is defined by the rule below for every value in its domain.",rule:"A = {-3,-1,1,3}, B = {-6,-2,2,6}, and f(x) = 2x.",ask:"State the domain of f.",worked:"The domain is the set of allowed input values, so the domain is A = {-3, -1, 1, 3}.",answers:["{-3,-1,1,3}","-3,-1,1,3"]},
        {id:"functions-v2-codomain",subtopic:0,context:"The function f maps elements of A to elements of B. Some values in B may not be used as outputs.",rule:"A = {1,2,3}, B = {2,3,4,5}, and f(x) = x + 1.",ask:"State the codomain of f.",worked:"The codomain is the set B given in the question. It is {2, 3, 4, 5}.",answers:["{2,3,4,5}","2,3,4,5"]},
        {id:"functions-v2-relation",subtopic:0,context:"A relation R maps elements of set A to elements of set B. Each element of A must have exactly one image for R to be a function.",rule:"A = {1,2,3}, B = {2,4,6}, and R = {(1,2),(2,4),(2,6),(3,6)}.",ask:"Determine whether R is a function from A to B.",worked:"No. The element 2 in A is paired with two different images, 4 and 6.",answers:["no","not a function"]},
        {id:"functions-v2-self-map",subtopic:0,context:"A function f is defined from set A to the same set A. A self-mapping must send every element of A to another element of A.",rule:"A = {1,2,3,4} and f(x) = 5 - x.",ask:"Does f map A into itself? Answer Yes or No.",worked:"Yes. The images are 4, 3, 2 and 1. All of them belong to A.",answers:["yes"]},
        {id:"functions-v2-injective",subtopic:0,context:"A function is one-to-one when different inputs always give different outputs.",rule:"The domain is A = {-2,-1,0,1,2}, and f(x) = x².",ask:"Is f one-to-one on A? Answer Yes or No.",worked:"No. For example, f(-1) = 1 and f(1) = 1, so two different inputs have the same output.",answers:["no"]},
        {id:"functions-v2-object",subtopic:0,context:"The function f maps an object x to its image. Find the object when the image is 11.",rule:"f(x) = 3x - 4.",ask:"Find the value of x.",worked:"Set 3x - 4 = 11. Then 3x = 15, so x = 5.",answers:["5","x=5"]},
        {id:"functions-v2-onto",subtopic:0,context:"A function f maps set A to set B. It is onto B if every value in B is an output of f.",rule:"A = {1,2,3}, B = {2,3,4,5}, and f(x) = x + 1.",ask:"Is f onto B? Answer Yes or No.",worked:"No. The range is {2, 3, 4}, so 5 in B is not an output.",answers:["no"]}
      ],
      [
        {id:"composite-v2-fg",subtopic:1,context:"The functions f and g are defined below. Apply g first, then apply f to the result.",rule:"f(x) = 2x + 4 and g(x) = 3/x, where x ≠ 0.",ask:"Find fg(x).",worked:"fg(x) = f(g(x)) = 2(3/x) + 4 = 6/x + 4.",answers:["6/x+4","(6+4x)/x"]},
        {id:"composite-v2-gf",subtopic:1,context:"The functions f and g are defined below. For gf(x), apply f first and then apply g.",rule:"f(x) = 3x - 1 and g(x) = 2x + 5.",ask:"Find gf(x).",worked:"gf(x) = g(f(x)) = 2(3x - 1) + 5 = 6x + 3.",answers:["6x+3"]},
        {id:"composite-v2-find-g",subtopic:1,context:"The function f is known, and the composite function gf is given. Use gf(x) = g(f(x)) to find the rule for g.",rule:"f(x) = 2x + 1 and gf(x) = 6x + 4.",ask:"Find g(x).",worked:"Let y = f(x) = 2x + 1. Then gf(x) = 3(2x + 1) + 1, so g(y) = 3y + 1. Therefore g(x) = 3x + 1.",answers:["3x+1"]},
        {id:"composite-v2-find-f",subtopic:1,context:"The function g is known, and the composite function gf is given. Use gf(x) = g(f(x)) to find f.",rule:"g(x) = 3x - 2 and gf(x) = 6x + 4.",ask:"Find f(x).",worked:"Since g(f(x)) = 3f(x) - 2 = 6x + 4, we get 3f(x) = 6x + 6. Hence f(x) = 2x + 2.",answers:["2x+2"]},
        {id:"composite-v2-gf-value",subtopic:1,context:"The functions f and g are applied one after another. Remember that gf(2) means g(f(2)).",rule:"f(x) = x² + 1 and g(x) = 2x - 3.",ask:"Find gf(2).",worked:"First, f(2) = 2² + 1 = 5. Then g(5) = 2(5) - 3 = 7.",answers:["7","gf(2)=7"]},
        {id:"composite-v2-fixed-point",subtopic:1,context:"For the functions below, fg(x) means f(g(x)). Find the positive value of x that is unchanged after applying the composite function.",rule:"f(x) = 2x + 4 and g(x) = 3/x, where x ≠ 0.",ask:"Find the positive value of x for which fg(x) = x.",worked:"2(3/x) + 4 = x. Multiplying by x gives x² - 4x - 6 = 0. Thus x = 2 ± √10, and the positive value is 2 + √10.",answers:["2+sqrt10","2+√10"]},
        {id:"composite-v2-fg-value",subtopic:1,context:"The functions f and g are applied in the order shown by fg(2) = f(g(2)).",rule:"f(x) = 3x - 2 and g(x) = 2x + 1.",ask:"Find fg(2).",worked:"First, g(2) = 5. Then f(5) = 3(5) - 2 = 13.",answers:["13","fg(2)=13"]},
        {id:"composite-v2-solve",subtopic:1,context:"The composite function fg is formed by applying g first and then f. Find the input that gives the stated output.",rule:"f(x) = 2x + 3 and g(x) = x - 4.",ask:"Find x if fg(x) = 15.",worked:"fg(x) = 2(x - 4) + 3 = 2x - 5. Set 2x - 5 = 15, so x = 10.",answers:["10","x=10"]}
      ],
      [
        {id:"inverse-v2-linear",subtopic:2,context:"A function f is one-to-one, so its inverse function exists. Find the rule of the inverse by making the subject x.",rule:"f(x) = 3x - 5.",ask:"Find f⁻¹(x).",worked:"Let y = 3x - 5. Then x = (y + 5)/3. Therefore f⁻¹(x) = (x + 5)/3.",answers:["(x+5)/3","x/3+5/3"]},
        {id:"inverse-v2-square-real",subtopic:2,context:"An inverse function can exist only if the original function is one-to-one on its domain.",rule:"f(x) = x² for all real x.",ask:"Does f have an inverse function on this domain? Answer Yes or No.",worked:"No. f(-2) = f(2) = 4, so different inputs have the same output.",answers:["no"]},
        {id:"inverse-v2-square-restricted",subtopic:2,context:"The domain of f is restricted to x ≥ 0. This restriction makes the function one-to-one, so its inverse exists.",rule:"f(x) = x², where x ≥ 0.",ask:"Find f⁻¹(9).",worked:"Since x ≥ 0 and x² = 9, x = 3. Therefore f⁻¹(9) = 3.",answers:["3","f^-1(9)=3"]},
        {id:"inverse-v2-recover",subtopic:2,context:"The inverse function of f is given. Reverse the steps to find the original function f.",rule:"f⁻¹(x) = (x - 4)/3.",ask:"Find f(x).",worked:"Let y = (x - 4)/3. Then 3y = x - 4, so x = 3y + 4. Hence f(x) = 3x + 4.",answers:["3x+4"]},
        {id:"inverse-v2-image",subtopic:2,context:"Use the inverse function to find the object that gives the stated image.",rule:"f(x) = 4x + 7.",ask:"Find f⁻¹(19).",worked:"Solve 4x + 7 = 19. Then 4x = 12, so x = 3. Thus f⁻¹(19) = 3.",answers:["3"]},
        {id:"inverse-v2-one-to-one",subtopic:2,context:"A function has an inverse on its domain when it is one-to-one. Check whether different inputs can give the same output.",rule:"f(x) = 2x + 1 for all real x.",ask:"Does f have an inverse function? Answer Yes or No.",worked:"Yes. If 2x₁ + 1 = 2x₂ + 1, then x₁ = x₂. The function is one-to-one.",answers:["yes"]},
        {id:"inverse-v2-finite",subtopic:2,context:"A function between two finite sets has an inverse if every output is paired with exactly one input.",rule:"A = {1,2,3}, B = {a,b,c}, and f = {(1,a),(2,b),(3,c)}.",ask:"Does f have an inverse function? Answer Yes or No.",worked:"Yes. Each element of B is paired with exactly one element of A, so the reverse relation is also a function.",answers:["yes"]},
        {id:"inverse-v2-domain",subtopic:2,context:"The inverse function swaps the input and output sets of the original function. Find the domain of the inverse.",rule:"f(x) = x + 3, where the domain of f is x ≥ 1.",ask:"State the domain of f⁻¹ in the form x ≥ k. Give k.",worked:"The smallest value of f(x) is 4 when x = 1. Therefore the range of f, and the domain of f⁻¹, is x ≥ 4.",answers:["4","x>=4"]}
      ]
    ];
        const subtopics=["Functions","Composite functions","Inverse functions"];
    const practiceFinalQuestions=[
      {id:"capstone-composite-inverse",marks:40,context:"Let f and g be functions defined for all real x. The notation gf(x) means g(f(x)).",rule:"f(x) = 2x + 1 and g(x) = 3x + 4.",parts:[
        {label:"(a)",prompt:"Find gf(x).",marks:10,subtopic:1,answers:["6x+7"],worked:"gf(x) = g(f(x)) = 3(2x + 1) + 4 = 6x + 7."},
        {label:"(b)",prompt:"Find x if gf(x) = 25.",marks:8,subtopic:1,answers:["3","x=3"],worked:"6x + 7 = 25, so 6x = 18 and x = 3."},
        {label:"(c)",prompt:"Is gf one-to-one for all real x? Answer Yes or No.",marks:8,subtopic:2,answers:["yes"],worked:"Yes. gf(x) = 6x + 7 is a linear function with a non-zero gradient, so different inputs have different outputs."},
        {label:"(d)",prompt:"Find (gf)⁻¹(x).",marks:14,subtopic:2,answers:["(x-7)/6","x/6-7/6"],worked:"Let y = 6x + 7. Then x = (y - 7)/6, so (gf)⁻¹(x) = (x - 7)/6."}
      ]},
      {id:"capstone-self-map",marks:40,context:"A function f maps the finite set A to itself. Its rule is given below.",rule:"A = {1,2,3,4} and f(x) = 5 - x.",parts:[
        {label:"(a)",prompt:"State the domain of f.",marks:5,subtopic:0,answers:["{1,2,3,4}","1,2,3,4","A"],worked:"The domain is A = {1, 2, 3, 4}."},
        {label:"(b)",prompt:"State the range of f.",marks:8,subtopic:0,answers:["{1,2,3,4}","1,2,3,4","A"],worked:"The images are 4, 3, 2 and 1, so the range is {1, 2, 3, 4}."},
        {label:"(c)",prompt:"Is f one-to-one? Answer Yes or No.",marks:8,subtopic:0,answers:["yes"],worked:"Yes. Every element of A has a different image."},
        {label:"(d)",prompt:"Find f⁻¹(2).",marks:9,subtopic:2,answers:["3"],worked:"Solve 5 - x = 2. Therefore x = 3, so f⁻¹(2) = 3."},
        {label:"(e)",prompt:"Does f map A into itself? Answer Yes or No.",marks:10,subtopic:0,answers:["yes"],worked:"Yes. Every image belongs to A, so f is a self-mapping function on A."}
      ]},
      {id:"capstone-find-function",marks:40,context:"The functions f and g are related by the composite function gf(x) = g(f(x)). The rule for f and the result of gf are known.",rule:"f(x) = 2x + 1 and gf(x) = 6x + 4.",parts:[
        {label:"(a)",prompt:"Find g(x).",marks:15,subtopic:1,answers:["3x+1"],worked:"Let y = f(x) = 2x + 1. Then gf(x) = 3(2x + 1) + 1, so g(y) = 3y + 1. Hence g(x) = 3x + 1."},
        {label:"(b)",prompt:"Find fg(x).",marks:10,subtopic:1,answers:["6x+3"],worked:"fg(x) = f(g(x)) = 2(3x + 1) + 1 = 6x + 3."},
        {label:"(c)",prompt:"Find x if fg(x) = 15.",marks:8,subtopic:1,answers:["2","x=2"],worked:"6x + 3 = 15, so x = 2."},
        {label:"(d)",prompt:"Is g one-to-one for all real x? Answer Yes or No.",marks:7,subtopic:2,answers:["yes"],worked:"Yes. g(x) = 3x + 1 is linear with a non-zero gradient."}
      ]},
      {id:"capstone-restricted-inverse",marks:40,context:"The function f is restricted to non-negative inputs so that it has an inverse. The function g is then applied to the output of f⁻¹.",rule:"f(x) = x² for x ≥ 0, and g(x) = 3x - 2.",parts:[
        {label:"(a)",prompt:"Find f⁻¹(x).",marks:10,subtopic:2,answers:["sqrtx","sqrt(x)"],worked:"Since x ≥ 0, the inverse of y = x² is x = √y. Thus f⁻¹(x) = √x."},
        {label:"(b)",prompt:"Find gf⁻¹(x).",marks:12,subtopic:1,answers:["3sqrtx-2","3sqrt(x)-2"],worked:"gf⁻¹(x) = g(√x) = 3√x - 2."},
        {label:"(c)",prompt:"Find gf⁻¹(9).",marks:8,subtopic:1,answers:["7"],worked:"f⁻¹(9) = 3, then g(3) = 3(3) - 2 = 7."},
        {label:"(d)",prompt:"State the domain of f⁻¹.",marks:10,subtopic:2,answers:["x>=0","{x:x>=0}","nonnegative real numbers"],worked:"The range of f is x ≥ 0, so the domain of f⁻¹ is x ≥ 0."}
      ]},
      {id:"capstone-self-mapping-composite",marks:40,context:"The composite function fg(x) is formed by applying g first and then f. Find the positive and negative fixed values of this composite function.",rule:"f(x) = 2x + 4 and g(x) = 3/x, where x ≠ 0.",parts:[
        {label:"(a)",prompt:"Find fg(x).",marks:8,subtopic:1,answers:["6/x+4","(6+4x)/x"],worked:"fg(x) = f(g(x)) = 2(3/x) + 4 = 6/x + 4."},
        {label:"(b)",prompt:"Find the positive value of x for which fg(x) = x.",marks:14,subtopic:1,answers:["2+sqrt10","2+√10"],worked:"6/x + 4 = x gives x² - 4x - 6 = 0. The positive solution is x = 2 + √10."},
        {label:"(c)",prompt:"Find the negative value of x for which fg(x) = x.",marks:13,subtopic:1,answers:["2-sqrt10","2-√10"],worked:"The other solution of x² - 4x - 6 = 0 is x = 2 - √10, which is negative."},
        {label:"(d)",prompt:"State the value of x that is excluded from the domain of g.",marks:5,subtopic:0,answers:["0","x=0"],worked:"The rule g(x) = 3/x is undefined when x = 0."}
      ]}
    ];

