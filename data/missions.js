/* =========================================================
   missions.js — JAVA CORE world & full curriculum
   7 regions · story · lessons · code · exercises
   ========================================================= */

const MISSIONS = [
  {
    id: 'm1',
    name: 'Java Foundation',
    icon: '🌱',
    color: '#22d39a',
    tagline: 'Boot up the runtime. Compile your first bytecode.',
    category: 'foundation',
    story: `Year 2099. The JAVA CORE mainframe has rebooted after a system-wide crash. The compiler daemon greets you: "Initiate, the runtime is alive but empty. Every great engineer begins by writing one line. Type your first incantation into the terminal and let the JVM breathe." Your quest begins at Terminal Zero — the gateway to all of Java CORE.`,
    lessons: [
      {
        title: 'Java History & The Three Pillars (JDK, JRE, JVM)',
        body: [
          'Java was created in 1995 by James Gosling at Sun Microsystems (now Oracle). Its slogan "Write Once, Run Anywhere" describes its platform independence.',
          'Three components work together:',
          '• <b>JVM</b> (Java Virtual Machine) — executes the bytecode. It is what makes Java platform-independent at runtime.',
          '• <b>JRE</b> (Java Runtime Environment) — contains the JVM + core libraries needed to <i>run</i> Java programs.',
          '• <b>JDK</b> (Java Development Kit) — contains the JRE + development tools (compiler <code>javac</code>, <code>java</code> launcher, debugger). Developers install the JDK.'
        ],
        analogy: 'Think of a movie: the JDK is the film studio (shoots &amp; edits), the JRE is the cinema projector room (plays the film), and the JVM is the projector itself (actually shows each frame to the audience).',
        code: `// Compile:  javac Hello.java   -> produces Hello.class (bytecode)
// Run:      java Hello          -> JVM executes the bytecode
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, JAVA CORE!");
    }
}`
      },
      {
        title: 'Program Structure & the main Method',
        body: [
          'Every Java application starts from a class. The file name must match the public class name. Execution always begins in <code>public static void main(String[] args)</code>.',
          '<code>public</code> — accessible from anywhere. <code>static</code> — runs without creating an object. <code>void</code> — returns nothing. <code>String[] args</code> — command-line arguments.',
          'Statements end with a semicolon <code>;</code>. Blocks are wrapped in curly braces <code>{ }</code>. Java is case-sensitive.'
        ],
        analogy: 'The main method is the ignition key of a car. The whole car (class) can sit there fully built, but nothing happens until you turn that key.',
        code: `public class Program {
    public static void main(String[] args) {
        int age = 20;
        System.out.println("Age is " + age);
    }
}`
      },
      {
        title: 'Variables, Primitive Types & Constants',
        body: [
          'A variable is a named memory slot. Java has 8 primitive types:',
          '• Whole numbers: <code>byte</code> (8-bit), <code>short</code> (16-bit), <code>int</code> (32-bit, default), <code>long</code> (64-bit, suffix L).',
          '• Decimals: <code>float</code> (32-bit, suffix f), <code>double</code> (64-bit, default).',
          '• <code>char</code> — single 16-bit Unicode character in single quotes \'<code>A</code>\'.',
          '• <code>boolean</code> — <code>true</code> or <code>false</code>.',
          'Constants use the keyword <code>final</code>. By convention their names are UPPER_SNAKE_CASE.'
        ],
        analogy: 'Primitives are like fixed-size storage boxes — once you pick a box size (int, double...) it can only hold that kind of value.',
        code: `int students = 15;
double gpa = 3.7;
char grade = 'A';
boolean passed = true;
final double PI = 3.14159;  // constant: cannot be reassigned
// PI = 3.0;  // ERROR: cannot assign to final variable`
      },
      {
        title: 'Operators & Expressions',
        body: [
          'Arithmetic: <code>+ - * / %</code>. Integer division truncates: <code>7 / 2</code> equals <code>3</code>, not 3.5. Use <code>%</code> (modulo) for remainders.',
          'Relational: <code>== != &lt; &gt; &lt;= &gt;=</code>. Logical: <code>&amp;&amp;</code> (and), <code>||</code> (or), <code>!</code> (not).',
          'Assignment: <code>= += -= *= /= %=</code>. Increment/decrement: <code>++ --</code> (prefix vs postfix differ in evaluation).',
          'Short-circuit: <code>&amp;&amp;</code> stops if the left side is false; <code>||</code> stops if the left side is true.'
        ],
        analogy: 'Operators are verbs in Java grammar — they act on the noun-like values (operands) around them.',
        code: `int a = 10, b = 3;
System.out.println(a / b);   // 3   (integer division)
System.out.println(a % b);   // 1   (remainder)
System.out.println(a > b && b > 0); // true
int c = a++;  // c = 10, then a becomes 11 (postfix)
int d = ++a;  // a becomes 12, then d = 12 (prefix)`
      },
      {
        title: 'Casting & Strings',
        body: [
          'Casting converts between types. <b>Widening</b> (int→double) is automatic and safe. <b>Narrowing</b> (double→int) requires an explicit cast and may lose data.',
          '<code>String</code> is a class (not a primitive) but has special syntax: double quotes. Concatenate with <code>+</code>. Common methods: <code>length()</code>, <code>charAt(i)</code>, <code>substring()</code>, <code>equals()</code>.',
          'Never compare Strings with <code>==</code> (compares references). Use <code>.equals()</code> (compares content).'
        ],
        analogy: 'Widening is pouring water from a small cup into a big bucket — nothing spills. Narrowing is pouring from a big bucket into a small cup — you may overflow and lose some.',
        code: `double d = 9.7;
int i = (int) d;          // 9 — decimal part truncated
String name = "Java";
System.out.println(name.length());      // 4
System.out.println(name.charAt(0));     // J
String a = "hi", b = "hi";
System.out.println(a == b);       // may be false (references)
System.out.println(a.equals(b));  // true  (content)`
      },
      {
        title: 'Scanner & Input/Output & Scope',
        body: [
          '<code>Scanner</code> reads typed input. Import <code>java.util.Scanner</code>. Common methods: <code>nextInt()</code>, <code>nextDouble()</code>, <code>nextLine()</code> (full line), <code>next()</code> (one word).',
          'Output: <code>System.out.print()</code> (no newline), <code>println()</code> (with newline), <code>printf()</code> (formatted).',
          '<b>Scope</b>: a variable exists only inside the block <code>{ }</code> where it was declared. Redeclaring inside a nested block shadows the outer one.'
        ],
        analogy: 'Scope is like a VIP area at a concert — your wristband (declaration) only lets you in for that one section. Outside, you have no access.',
        code: `import java.util.Scanner;
public class Input {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Name: ");
        String name = sc.nextLine();
        System.out.print("Age: ");
        int age = sc.nextInt();
        System.out.printf("Hi %s, you are %d%n", name, age);
    }
}`
      }
    ],
    exercises: [
      { q: 'Declare an <code>int</code> variable <code>x</code> with value 5 and print it.', a: 'int x = 5; System.out.println(x);' },
      { q: 'Write a line that reads an integer from a Scanner <code>sc</code>.', a: 'int n = sc.nextInt();' },
      { q: 'Compute and print <code>7 / 2</code> as a decimal 3.5.', a: 'System.out.println(7.0 / 2); // or (double)7/2' }
    ]
  },

  {
    id: 'm2',
    name: 'Control Flow Lab',
    icon: '🧭',
    color: '#00f0ff',
    tagline: 'Bend time and branches. Loop through the logic labyrinth.',
    category: 'controlflow',
    story: `Past Terminal Zero lies the Control Flow Lab — a neon chamber of valves and junctions. Each valve is a decision; each loop is a closed conveyor. An AI guardian named Fork warns: "Without control, your code runs once and dies. Master the branches, or the labyrinth will trap you in an infinite spin." Learn to route execution, and the lab's gates will open.`,
    lessons: [
      {
        title: 'if, if-else, nested if',
        body: [
          '<code>if (condition) { ... }</code> runs a block only when the condition is true.',
          '<code>else</code> runs when the if is false. <code>else if</code> chains multiple exclusive checks.',
          'Nested ifs are ifs inside ifs — useful for multi-step decisions. Keep nesting shallow for readability.'
        ],
        analogy: 'An if-statement is a toll booth on a highway. If you have the right pass (true) you go through; otherwise you take the detour (else).',
        code: `int score = 82;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
} else if (score >= 70) {
    System.out.println("C");
} else {
    System.out.println("F");
}`
      },
      {
        title: 'switch',
        body: [
          '<code>switch</code> chooses one path among many based on a single value (int, char, String, enum).',
          'Each <code>case</code> ends with <code>break</code>; without it, execution <b>falls through</b> to the next case.',
          '<code>default</code> handles unmatched values. Modern Java (14+) also supports switch expressions with <code>-&gt;</code>.'
        ],
        analogy: 'A switch is a railway pointsman — depending on which lever (value) is pulled, the train is routed onto one specific track.',
        code: `int day = 3;
switch (day) {
    case 1: System.out.println("Mon"); break;
    case 2: System.out.println("Tue"); break;
    case 3: System.out.println("Wed"); break;
    default: System.out.println("Other");
}`
      },
      {
        title: 'for, while, do-while',
        body: [
          '<code>for (init; condition; update) { ... }</code> — best when you know the count.',
          '<code>while (cond) { ... }</code> — checks first, then loops. May run zero times.',
          '<code>do { ... } while (cond);</code> — runs the body first, then checks. Always runs at least once.'
        ],
        analogy: 'A for-loop is a treadmill set for exactly 10 minutes. A while-loop is "run until you are tired". A do-while is "run at least one lap, then check if you are tired".',
        code: `for (int i = 1; i <= 3; i++) System.out.println(i); // 1 2 3

int n = 5;
while (n > 0) { System.out.println(n); n--; }

int x;
do { x = readInput(); } while (x < 0);`
      },
      {
        title: 'Nested loops, break & continue',
        body: [
          'A loop inside a loop. Inner loop fully runs for each iteration of the outer loop — used for tables, matrices, patterns.',
          '<code>break</code> exits the nearest enclosing loop immediately.',
          '<code>continue</code> skips the rest of the current iteration and jumps to the next one.',
          'Labeled breaks (<code>break outer;</code>) can exit nested loops at once.'
        ],
        analogy: 'Nested loops are like a clock — the minute hand (inner loop) completes a full cycle for every step of the hour hand (outer loop).',
        code: `for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (i == j) continue;       // skip diagonal
        System.out.print(i + "" + j + " ");
    }
}
// Output: 12 13 21 23 31 32`
      },
      {
        title: 'Loop Conversion',
        body: [
          'Any for-loop can become a while-loop and vice versa. The three parts (init / condition / update) just move to different places.',
          'Choose by intent: for = known count, while = unknown count, do-while = at least one execution.'
        ],
        analogy: 'Loop conversion is like rewriting the same recipe with different utensils — the dish is identical, only the tools change.',
        code: `// for
for (int i = 0; i < 5; i++) System.out.println(i);

// converted to while
int i = 0;
while (i < 5) { System.out.println(i); i++; }`
      }
    ],
    exercises: [
      { q: 'Print numbers 1 to 10 with a for-loop.', a: 'for (int i=1;i<=10;i++) System.out.println(i);' },
      { q: 'Print even numbers 2..20 using continue.', a: 'for(int i=1;i<=20;i++){if(i%2!=0)continue;System.out.println(i);}' },
      { q: 'Convert <code>for(int i=0;i&lt;5;i++) print(i)</code> to a while loop.', a: 'int i=0; while(i<5){print(i); i++;}' }
    ]
  },

  {
    id: 'm3',
    name: 'Arrays & Memory City',
    icon: '🏙️',
    color: '#ffd166',
    tagline: 'Rows of memory cells. Index like a hacker.',
    category: 'arrays',
    story: `The Control Flow Lab opens onto Memory City — a glowing skyline of identical towers, each tower a row of memory cells. The Mayor explains: "Each cell has an address — its index. Master indexing and you command the entire skyline in one statement." In this region you will learn to store many values under one name, walk every cell with the enhanced for-loop, and build grids of towers (2D arrays) and ragged neighborhoods.`,
    lessons: [
      {
        title: '1D Arrays — declaration, indexing, length',
        body: [
          'An array is a fixed-size sequence of same-type values stored contiguously.',
          'Declare: <code>int[] arr = new int[5];</code> (5 zeros) or <code>int[] arr = {10,20,30};</code> (literal).',
          'Indexes start at <b>0</b> and go to <code>length-1</code>. Access <code>arr[i]</code>. Length: <code>arr.length</code> (no parentheses — it is a field, not a method).',
          'Going out of bounds throws <code>ArrayIndexOutOfBoundsException</code>.'
        ],
        analogy: 'An array is a row of numbered mailboxes. The first mailbox is 0, not 1. Try mailbox 100 in a row of 5 and the postmaster throws an exception.',
        code: `int[] scores = new int[5];        // [0,0,0,0,0]
scores[0] = 95;
int[] nums = {10, 20, 30};
System.out.println(nums.length);   // 3
System.out.println(nums[1]);       // 20`
      },
      {
        title: 'Enhanced for-loop',
        body: [
          'The enhanced for-loop (a.k.a. for-each) iterates every element without an index.',
          'Syntax: <code>for (type var : array) { ... }</code>.',
          'Read-only: you cannot modify the array through the loop variable (it is a copy of the value for primitives).'
        ],
        analogy: 'A for-each is like a conveyor belt — items come to you one by one; you do not need to know their position.',
        code: `int[] nums = {10, 20, 30};
int sum = 0;
for (int n : nums) {
    sum += n;
}
System.out.println(sum);  // 60`
      },
      {
        title: 'Searching, sum, max, min, average',
        body: [
          'Linear search: walk the array comparing each element to the target.',
          'Sum / average: accumulate in a variable, then divide.',
          'Max / min: start with the first element, update as you scan. Avoid starting max at 0 (fails for all-negative arrays).'
        ],
        analogy: 'Linear search is flipping through flashcards one by one until you find the one you want — slow but guaranteed.',
        code: `int[] a = {3, 9, 1, 7, 5};
int max = a[0], sum = 0;
for (int x : a) { if (x > max) max = x; sum += x; }
double avg = (double) sum / a.length;
System.out.println(max + " " + sum + " " + avg); // 9 25 5.0`
      },
      {
        title: 'Sorting basics & 2D arrays',
        body: [
          'Simple sorts: bubble sort and selection sort — both O(n²). For real code use <code>Arrays.sort(arr)</code>.',
          'A 2D array is an array of arrays: <code>int[][] m = new int[3][4];</code> — 3 rows, 4 columns.',
          'Access <code>m[row][col]</code>. Row count: <code>m.length</code>. Column count of row r: <code>m[r].length</code>.',
          'Matrix addition: add corresponding cells of two same-shaped matrices.'
        ],
        analogy: 'A 2D array is a spreadsheet — rows and columns. Each row is itself an array, so a 2D array is an array of arrays.',
        code: `int[][] grid = {
    {1, 2, 3},
    {4, 5, 6}
};
for (int r = 0; r < grid.length; r++) {
    for (int c = 0; c < grid[r].length; c++) {
        System.out.print(grid[r][c] + " ");
    }
    System.out.println();
}`
      },
      {
        title: 'Jagged arrays & references & ArrayList',
        body: [
          'A <b>jagged array</b> has rows of different lengths — possible because each row is a separate array.',
          'Arrays are <b>reference types</b>: assigning <code>int[] b = a;</code> does not copy — both names point to the same memory. Use <code>Arrays.copyOf</code> to clone.',
          '<code>ArrayList</code> is a resizable array from <code>java.util</code>: <code>add</code>, <code>get</code>, <code>set</code>, <code>remove</code>, <code>size()</code>. Unlike plain arrays, it grows automatically.'
        ],
        analogy: 'ArrayList is a stretchy array — like a rubber band that holds more items as you push them in. A plain array is a fixed-size box.',
        code: `import java.util.ArrayList;
ArrayList<String> list = new ArrayList<>();
list.add("Java");
list.add("Quest");
list.add(0, "Hi");          // insert at index 0
System.out.println(list.get(1));  // Java
System.out.println(list.size()); // 3`
      }
    ],
    exercises: [
      { q: 'Declare an int array of 10 zeros.', a: 'int[] a = new int[10];' },
      { q: 'Find the maximum of <code>{5,2,9,1,7}</code>.', a: 'int max = a[0]; for(int x:a) if(x>max) max=x;' },
      { q: 'Print a 2x3 matrix of all 1s.', a: 'int[][] m = {{1,1,1},{1,1,1}};' }
    ]
  },

  {
    id: 'm4',
    name: 'Methods & Recursion',
    icon: '🌀',
    color: '#8b5cf6',
    tagline: 'Package logic. Descend the call stack.',
    category: 'methods',
    story: `Leaving Memory City you enter the Spiral Spire — a tower of stacked function frames. Each floor is a method call; the stairwell between them is the call stack. The Spiral Architect declares: "To ascend you must learn to package logic into named blocks, and to descend into yourself — recursion. Climb too deep without a base case and the tower will collapse upon you."`,
    lessons: [
      {
        title: 'Void & return methods, parameters & arguments',
        body: [
          'A method is a named, reusable block. <b>Parameters</b> are the variables declared in the signature; <b>arguments</b> are the actual values you pass when calling.',
          '<code>void</code> methods do something but return nothing. Return methods declare a return type and must <code>return</code> a value of that type.',
          'A method that returns non-void can be used inside expressions; a void method cannot.'
        ],
        analogy: 'A method is a vending machine. Parameters are the coin slot and item code (what it asks for). The returned snack is the return value. A void method is one that just prints a receipt — it gives you nothing back.',
        code: `void greet(String name) {                    // void
    System.out.println("Hi " + name);
}
int square(int x) {                          // returns int
    return x * x;
}
// call:
greet("Omar");
int area = square(5);   // 25`
      },
      {
        title: 'Method overloading & pass-by-value',
        body: [
          '<b>Overloading</b>: multiple methods with the same name but different parameter lists (number or type). The compiler picks the matching one.',
          'Java is strictly <b>pass-by-value</b>. For primitives, the value is copied. For objects/arrays, the <i>reference value</i> is copied — so the method can mutate the object contents, but reassigning the parameter inside the method does not affect the caller.',
          'Return type alone does NOT distinguish overloads — parameter list must differ.'
        ],
        analogy: 'Overloading is one friend named "Alex" who responds differently depending on whether you whisper, shout, or text. Same name, different input shape.',
        code: `int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }  // overload

void mutate(int[] arr) { arr[0] = 99; }   // visible to caller
void reassign(int[] arr) { arr = new int[]{0}; } // NOT visible`
      },
      {
        title: 'Call stack',
        body: [
          'Every method call pushes a <b>frame</b> onto the call stack. The frame holds the method\'s local variables and the return address.',
          'When the method returns, its frame is popped. Deep recursion = many frames = risk of <code>StackOverflowError</code>.',
          'The currently executing method is always on top of the stack.'
        ],
        analogy: 'The call stack is a stack of plates in a cafeteria. Each method call adds a plate on top; returning removes it. You can only interact with the top plate.',
        code: `void a() { b(); }
void b() { c(); }
void c() { System.out.println("deep"); }
// Stack when println runs: a -> b -> c
// then c pops, b pops, a pops.`
      },
      {
        title: 'Recursion — base case & recursive case',
        body: [
          'A recursive method calls itself. It MUST have a <b>base case</b> (when to stop) and a <b>recursive case</b> (calling itself on a smaller problem).',
          'Without a base case, recursion runs forever and crashes with <code>StackOverflowError</code>.',
          'Every recursive algorithm can be rewritten iteratively, and vice versa — but some problems (trees, divide-and-conquer) read more naturally as recursion.'
        ],
        analogy: 'Recursion is asking a friend to count the stairs for you. They take one step, then ask "the rest" of themselves to count from the next step — until there are no more steps (base case), and the answers bubble back up.',
        code: `int factorial(int n) {
    if (n <= 1) return 1;           // base case
    return n * factorial(n - 1);    // recursive case
}
// factorial(4) = 4 * factorial(3)
//             = 4 * 3 * factorial(2)
//             = 4 * 3 * 2 * factorial(1)
//             = 4 * 3 * 2 * 1 = 24`
      },
      {
        title: 'Factorial, Fibonacci, GCD',
        body: [
          '<b>Factorial</b> n! = n × (n-1) × ... × 1. Base case: 0! = 1 or 1! = 1.',
          '<b>Fibonacci</b>: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2). Naive recursion is exponential; memoization makes it linear.',
          '<b>GCD</b> (Euclid): gcd(a,b) = gcd(b, a%b); base case gcd(a,0)=a.'
        ],
        analogy: 'Fibonacci is the family tree of bees: each number is the sum of its two parents. GCD via Euclid is "keep replacing the bigger number with the remainder until nothing is left".',
        code: `int fib(int n) {
    if (n < 2) return n;
    return fib(n-1) + fib(n-2);
}
int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}`
      }
    ],
    exercises: [
      { q: 'Write <code>int max(int a, int b)</code> returning the larger.', a: 'int max(int a,int b){return a>b?a:b;}' },
      { q: 'Recursive factorial of 5 = ?', a: '120  (5*4*3*2*1)' },
      { q: 'Overload <code>add</code> for two and three ints.', a: 'int add(int a,int b){return a+b;} int add(int a,int b,int c){return a+b+c;}' }
    ]
  },

  {
    id: 'm5',
    name: 'OOP City',
    icon: '🏰',
    color: '#d946ef',
    tagline: 'The crown jewel. Build worlds from classes and objects.',
    category: 'oop',
    story: `Beyond the Spiral Spire rises OOP City — a glittering metropolis where every building is a Class and every citizen an Object. The Mayor-Constructor greets you: "Here, data and behavior live together under one roof. You will learn to encapsulate, inherit, abstract, and polymorph — the four sacred pillars. This is the most important region in all of JAVA CORE. Study every building."`,
    buildings: [
      { icon: '🏛️', name: 'Class & Object', concept: 'A class is a blueprint; an object is an instance built from it.' },
      { icon: '🧱', name: 'Attributes & Methods', concept: 'Fields hold state; methods define behavior.' },
      { icon: '🏗️', name: 'Constructors', concept: 'Special methods that initialize a new object.' },
      { icon: '🔑', name: 'Encapsulation', concept: 'Hide internal state behind methods; protect your data.' },
      { icon: '🧬', name: 'Inheritance', concept: 'A subclass reuses and extends a superclass via extends.' },
      { icon: '🎭', name: 'Polymorphism', concept: 'One reference, many forms — via overriding & dynamic dispatch.' },
      { icon: '📐', name: 'Abstract & Interface', concept: 'Define contracts without implementation.' },
      { icon: '🚮', name: 'Garbage Collection', concept: 'JVM reclaims unreachable objects automatically.' }
    ],
    lessons: [
      {
        title: 'Classes, Objects, Attributes, Methods',
        body: [
          'A <b>class</b> is a blueprint. An <b>object</b> is a concrete instance built from it with <code>new</code>.',
          '<b>Attributes</b> (fields/instance variables) hold the object\'s state. <b>Methods</b> define its behavior.',
          'Inside the class, methods can read and write the object\'s fields directly. From outside, use <code>obj.field</code> or <code>obj.method()</code>.'
        ],
        analogy: 'A class is a cookie cutter; objects are the cookies stamped from it. Each cookie can have different sprinkles (state), but they all share the same shape (class).',
        code: `class Student {
    String name;     // attribute
    int grade;       // attribute

    void introduce() {   // method
        System.out.println("I am " + name);
    }
}
Student s = new Student();
s.name = "Ahmed";
s.introduce();    // I am Ahmed`
      },
      {
        title: 'Constructors & Constructor Overloading & this',
        body: [
          'A <b>constructor</b> has the same name as the class, no return type, and runs once when an object is created with <code>new</code>.',
          'You can <b>overload</b> constructors. <code>this(...)</code> calls another constructor in the same class — must be the first statement.',
          '<code>this</code> refers to the current object. Use it to disambiguate when a parameter shadows a field (<code>this.name = name;</code>).'
        ],
        analogy: 'A constructor is the opening ceremony of a new building — it sets up the furniture and welcome sign before anyone moves in.',
        code: `class Book {
    String title;
    int pages;
    Book() { this("Untitled", 0); }            // delegating
    Book(String t) { this(t, 0); }
    Book(String title, int pages) {
        this.title = title;       // 'this' disambiguates
        this.pages = pages;
    }
}
Book b = new Book("Java Quest", 320);`
      },
      {
        title: 'Encapsulation, Getters, Setters, Access Modifiers',
        body: [
          '<b>Encapsulation</b> bundles data with the methods that operate on it, and hides internal state using <code>private</code> fields plus <b>getters/setters</b>.',
          'Access modifiers: <code>private</code> (same class only), <code>default/package-private</code> (same package), <code>protected</code> (package + subclasses), <code>public</code> (everywhere).',
          'Setters let you validate before writing — a guardrail for your data.'
        ],
        analogy: 'Encapsulation is a bank vault: the cash (data) is private. Customers can deposit or withdraw only through the teller (public methods), never by reaching into the vault.',
        code: `class Account {
    private double balance;
    public double getBalance() { return balance; }
    public void deposit(double amt) {
        if (amt > 0) balance += amt;
    }
}
Account a = new Account();
a.deposit(100);
// a.balance = 100;  // ERROR: balance is private`
      },
      {
        title: 'Static & Instance Variables',
        body: [
          'An <b>instance variable</b> belongs to each object — each object has its own copy.',
          'A <b>static variable</b> belongs to the class itself — one shared copy across all instances. Use the class name to access it: <code>ClassName.field</code>.',
          '<b>Static methods</b> cannot use instance fields directly (no <code>this</code>). <code>main</code> is static so the JVM can call it without creating an object.'
        ],
        analogy: 'Instance variables are each student\'s own notebook. A static variable is the school noticeboard — one shared board that every student reads and writes to.',
        code: `class Counter {
    static int total = 0;   // shared
    int id;                 // per-object
    Counter() { total++; id = total; }
}
new Counter(); new Counter();
System.out.println(Counter.total);  // 2`
      },
      {
        title: 'Inheritance, extends, super',
        body: [
          '<b>Inheritance</b> lets a subclass reuse fields and methods of a superclass with <code>extends</code>. Java allows single inheritance only (one direct superclass).',
          '<code>super</code> refers to the parent. <code>super()</code> calls the parent constructor (must be first line). <code>super.method()</code> calls an overridden parent method.',
          'Every class implicitly extends <code>Object</code> if no other parent — so <code>toString</code>, <code>equals</code>, <code>hashCode</code> are inherited by all.'
        ],
        analogy: 'Inheritance is genetics: a Child class inherits traits (fields/methods) from the Parent class, then adds or overrides its own.',
        code: `class Animal {
    String name;
    Animal(String n) { name = n; }
    void speak() { System.out.println("..."); }
}
class Dog extends Animal {
    Dog(String n) { super(n); }
    void speak() { System.out.println("Woof!"); }
}
Animal a = new Dog("Rex");
a.speak();   // Woof!`
      },
      {
        title: 'Overloading vs Overriding',
        body: [
          '<b>Overloading</b>: same method name, different parameter list, in the SAME class. Resolved at <i>compile time</i> (static binding).',
          '<b>Overriding</b>: subclass redefines a parent method with the SAME signature. Resolved at <i>runtime</i> based on the actual object type (dynamic dispatch).',
          'Override rules: same name, same parameters, compatible return type, access not more restrictive. Use <code>@Override</code> annotation to catch mistakes.',
          'You cannot override a <code>static</code>, <code>private</code>, or <code>final</code> method.'
        ],
        analogy: 'Overloading is one chef making pizza in three sizes (small/medium/large) — chosen when you order. Overriding is a junior chef replacing the senior\'s recipe with their own version — chosen when the dish is actually cooked.',
        code: `class Shape {
    double area() { return 0; }
    double area(int r) { return Math.PI*r*r; }  // overload
}
class Square extends Shape {
    double side;
    double area() { return side*side; }   // override (same sig)
}`
      },
      {
        title: 'Polymorphism & Dynamic Dispatch',
        body: [
          '<b>Polymorphism</b> = "many forms". A parent-type reference can hold a child object: <code>Animal a = new Dog();</code>.',
          'At runtime, <code>a.speak()</code> calls the <i>actual</i> object\'s version (Dog), not the reference type\'s (Animal). This is <b>dynamic dispatch</b>.',
          'Enables writing generic code: <code>for (Shape s : shapes) total += s.area();</code> works for any subclass of Shape.'
        ],
        analogy: 'Polymorphism is a universal remote: the same "play" button works on a TV, a soundbar, or a Blu-ray player — each device responds in its own way at the moment you press it.',
        code: `class Animal { void speak(){System.out.println("...");} }
class Dog extends Animal { void speak(){System.out.println("Woof");} }
class Cat extends Animal { void speak(){System.out.println("Meow");} }
Animal[] zoo = { new Dog(), new Cat() };
for (Animal a : zoo) a.speak();   // Woof  Meow`
      },
      {
        title: 'Abstract Classes & Interfaces',
        body: [
          'An <b>abstract class</b> cannot be instantiated; it can have both concrete and <code>abstract</code> methods (no body). Subclasses must implement the abstract methods.',
          'An <b>interface</b> is a pure contract: all methods are (traditionally) abstract and public. A class <code>implements</code> an interface. A class can implement MULTIPLE interfaces (but extend only one class).',
          'Since Java 8, interfaces can have <code>default</code> and <code>static</code> methods with bodies; since Java 9, <code>private</code> helper methods too.',
          'Use abstract class when subclasses share state/identity; use interface to define a capability shared across unrelated classes.'
        ],
        analogy: 'An abstract class is a half-built house with the furniture layout fixed but some rooms left for the buyer to finish. An interface is a building code — any building, any architect, must follow the same safety rules.',
        code: `interface Drawable { void draw(); }
abstract class Shape {
    abstract double area();
    void info(){ System.out.println("area=" + area()); }
}
class Circle extends Shape implements Drawable {
    double r;
    double area(){ return Math.PI*r*r; }
    public void draw(){ System.out.println("circle"); }
}`
      },
      {
        title: 'final, Packages, UML',
        body: [
          '<code>final</code> on a variable = constant. On a method = cannot be overridden. On a class = cannot be extended (e.g. <code>String</code>, <code>Integer</code>).',
          'A <b>package</b> groups related classes. Declared at the top: <code>package com.quest.oop;</code>. Import with <code>import com.quest.oop.Student;</code> or <code>import com.quest.oop.*;</code>.',
          '<b>UML</b> (Unified Modeling Language) diagrams visualize class structure: classes as boxes with three compartments (name / attributes / methods). Inheritance is an open-triangle arrow; implementation is a dashed open-triangle arrow.'
        ],
        analogy: 'A package is a folder in a filing cabinet. final is a wax seal — once sealed, it cannot be modified, replaced, or extended. UML is the architect\'s blueprint sketch.',
        code: `package com.quest.oop;

public final class Config {     // cannot be extended
    public static final int MAX = 100;  // constant
}`
      },
      {
        title: 'equals() vs ==, null, Garbage Collection',
        body: [
          '<code>==</code> compares <b>references</b> (do they point to the same object?). <code>.equals()</code> compares <b>content</b> — but only if the class overrides it. String and the wrapper classes do; your own classes inherit Object\'s version, which uses ==.',
          '<code>null</code> means "no object". Calling a method on null throws <code>NullPointerException</code>. Always null-check external input.',
          '<b>Garbage Collection</b>: the JVM automatically frees objects that are no longer reachable from any live reference. You do not (and should not) manually free memory. You can hint with <code>System.gc()</code> but it is not guaranteed.'
        ],
        analogy: '== asks "are these two people the same person?". equals asks "do these two people look identical?". Garbage collection is the city\'s cleaning crew — they sweep up anything no one is holding.',
        code: `String a = new String("hi");
String b = new String("hi");
System.out.println(a == b);        // false (different objects)
System.out.println(a.equals(b));   // true  (same content)

Student s = null;
// s.name;  // NullPointerException
s = new Student();
s = null;   // the old object is now eligible for GC`
      }
    ],
    exercises: [
      { q: 'Declare a class <code>Car</code> with fields <code>brand</code>, <code>speed</code> and a method <code>drive()</code>.', a: 'class Car { String brand; int speed; void drive(){} }' },
      { q: 'Make <code>speed</code> private with a getter and a setter that rejects negatives.', a: 'private int speed; public int getSpeed(){return speed;} public void setSpeed(int s){ if(s>=0) speed=s; }' },
      { q: 'Compare two Strings <code>a</code>, <code>b</code> by content.', a: 'a.equals(b)' },
      { q: 'Make <code>Dog</code> extend <code>Animal</code> and override <code>speak()</code>.', a: 'class Dog extends Animal { void speak(){ System.out.println("Woof"); } }' }
    ]
  },

  {
    id: 'm6',
    name: 'System Recovery',
    icon: '🛠️',
    color: '#ff8a3d',
    tagline: 'Catch the crashes. Handle the unexpected.',
    category: 'exceptions',
    story: `OOP City's power grid flickers — exceptions are leaking through the data-streams. The Recovery Engineer hands you a shield: <code>try</code>, <code>catch</code>, <code>finally</code>. "Errors are not the end," she says, "they are signals. Wrap the dangerous code, name the failure, and your program lives to run another line." Learn to throw, to catch, to recover — and to file your data safely before the next crash.`,
    lessons: [
      {
        title: 'Errors: Compile, Runtime, Logical',
        body: [
          '<b>Compile errors</b>: syntax/type mistakes caught by <code>javac</code> before the program runs (missing semicolon, type mismatch). The program will not even start.',
          '<b>Runtime errors</b>: the program compiles but crashes during execution — division by zero, null access, out-of-bounds. These are <code>Exception</code>s.',
          '<b>Logical errors</b>: the program runs but produces wrong output (off-by-one, wrong formula). The hardest to find — use tests and prints.'
        ],
        analogy: 'Compile error = the recipe has a typo so the chef refuses to start. Runtime error = the chef starts cooking but the oven explodes mid-way. Logical error = the chef finishes a cake that tastes wrong — looks fine, but is incorrect.',
        code: `// Compile error:
// int x = "hello";   // type mismatch

// Runtime error:
int[] a = new int[3];
// System.out.println(a[10]);  // ArrayIndexOutOfBoundsException

// Logical error:
double avg = 1 + 2 + 3 / 3;  // 4.0  (forgot parentheses)`
      },
      {
        title: 'try, catch, finally',
        body: [
          '<code>try { ... }</code> wraps risky code. <code>catch (ExceptionType e) { ... }</code> handles matching exceptions. <code>finally { ... }</code> ALWAYS runs — even if an exception was thrown or a return happened.',
          'You can chain multiple catch blocks, ordered from most-specific to most-general. Since Java 7 you can catch multiple types in one block: <code>catch (IOException | SQLException e)</code>.',
          'Use finally to release resources (close files, sockets).'
        ],
        analogy: 'try-catch-finally is skydiving: try = jump, catch = the parachute opens when something goes wrong, finally = you always pack up your gear afterward, no matter what.',
        code: `try {
    int x = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Math error: " + e.getMessage());
} finally {
    System.out.println("Always runs");
}`
      },
      {
        title: 'throw & throws & exception hierarchy',
        body: [
          '<code>throw new ExceptionType("msg");</code> manually raises an exception.',
          '<code>throws</code> in a method signature declares that the method may throw a <b>checked</b> exception — callers must handle or declare it too.',
          'Hierarchy: <code>Throwable</code> → <code>Error</code> (do not catch: JVM problems like OutOfMemoryError) and <code>Exception</code>. Under Exception: <b>checked</b> (must declare/catch: IOException, SQLException) and <b>unchecked</b> / <code>RuntimeException</code> (optional: NullPointerException, ArithmeticException).'
        ],
        analogy: 'throw is pulling the fire alarm yourself. throws is a sign on the door saying "this room may contain fire — enter prepared". Errors are earthquakes (you cannot plan for them); checked exceptions are scheduled fire drills; unchecked are slips on a wet floor.',
        code: `public int readAge() throws Exception {
    int age = readInput();
    if (age < 0) throw new IllegalArgumentException("Negative age");
    return age;
}`
      },
      {
        title: 'Custom exceptions & File I/O',
        body: [
          'To create a custom exception, extend <code>Exception</code> (checked) or <code>RuntimeException</code> (unchecked). Add a constructor that calls <code>super(message)</code>.',
          'File I/O uses streams. <code>java.io.FileReader / FileWriter</code> for text; <code>BufferedReader / BufferedWriter</code> for line-by-line efficiency. <code>java.util.Scanner</code> can also read a File.',
          'File operations declare <code>throws IOException</code>. Wrap in try-with-resources (Java 7+) to auto-close: <code>try (BufferedReader br = new BufferedReader(new FileReader(f))) { ... }</code>.'
        ],
        analogy: 'A custom exception is a custom warning label you design — "InvalidStudentException" says exactly what went wrong in your domain, far clearer than a generic "Exception".',
        code: `class InvalidAgeException extends Exception {
    public InvalidAgeException(String msg) { super(msg); }
}
// File read:
try (java.io.BufferedReader br = new java.io.BufferedReader(
        new java.io.FileReader("data.txt"))) {
    String line;
    while ((line = br.readLine()) != null) System.out.println(line);
} catch (java.io.IOException e) {
    System.out.println("IO error: " + e.getMessage());
}`
      }
    ],
    exercises: [
      { q: 'Wrap <code>int x=10/0;</code> in try/catch.', a: 'try{int x=10/0;}catch(ArithmeticException e){System.out.println(e.getMessage());}' },
      { q: 'Declare a method that may throw <code>IOException</code>.', a: 'void load() throws IOException { ... }' },
      { q: 'Create a custom exception <code>BadScoreException</code>.', a: 'class BadScoreException extends Exception { public BadScoreException(String m){super(m);} }' }
    ]
  },

  {
    id: 'm7',
    name: 'Advanced Systems',
    icon: '🚀',
    color: '#ff5470',
    tagline: 'Threads, builds and the final boss.',
    category: 'advanced',
    story: `The last region is the orbital station of Advanced Systems. Multiple threads dance through its halls; the synchronization locks keep them from colliding. The Station Commander greets you: "Concurrency is power and danger. One missed <code>synchronized</code> and your data corrupts silently." Here you will also master packaging your code into a JAR and automating builds with Ant. At the summit waits the FINAL BOSS — a gauntlet of every concept you have learned. Defeat it to graduate JAVA CORE.`,
    lessons: [
      {
        title: 'Threads & Multithreading',
        body: [
          'A <b>thread</b> is an independent flow of execution inside a program. The JVM starts your program in the <b>main</b> thread; you can spawn more.',
          'Two ways to create a thread: (1) extend <code>Thread</code> and override <code>run()</code>, then call <code>start()</code>; (2) implement <code>Runnable</code> and pass it to <code>new Thread(runnable)</code>. Runnable is preferred — separation of task from thread.',
          '<code>start()</code> schedules the thread; <code>run()</code> just calls the method in the current thread (no new thread). Common methods: <code>sleep(ms)</code>, <code>join()</code>, <code>getName()</code>, <code>setPriority()</code>.'
        ],
        analogy: 'A thread is a worker in a factory. The main thread is the first worker. <code>start()</code> hires a new worker; <code>run()</code> just tells an existing worker to follow the instruction sheet without hiring anyone new.',
        code: `class Worker extends Thread {
    public void run() {
        for (int i = 0; i < 3; i++)
            System.out.println(getName() + " " + i);
    }
}
new Worker().start();
new Worker().start();
// Output interleaves the two workers' prints.`
      },
      {
        title: 'Synchronization & synchronized',
        body: [
          'When multiple threads access shared mutable data, results become unpredictable: a <b>race condition</b>.',
          '<code>synchronized</code> creates a lock (monitor). Only one thread at a time can execute a synchronized method or block on the same object.',
          '<code>synchronized void m()</code> locks the whole method on <code>this</code>. <code>synchronized(obj) { ... }</code> locks a specific object — finer-grained.',
          'Deadlock: two threads each hold a lock the other needs. Avoid by locking in a consistent global order.'
        ],
        analogy: 'Synchronization is a single key to a meeting room. Whoever holds the key enters; everyone else waits outside. Without it, two people try to write on the same whiteboard and overwrite each other.',
        code: `class Counter {
    private int count = 0;
    public synchronized void inc() { count++; }
    public int get() { return count; }
}`
      },
      {
        title: 'JAR & Ant',
        body: [
          'A <b>JAR</b> (Java Archive) is a ZIP file containing compiled <code>.class</code> files plus a <code>MANIFEST.MF</code> that can declare the main class. Build with <code>jar cf app.jar -C build .</code> or <code>jar cfe app.jar Main -C build .</code>.',
          'Run an executable JAR with <code>java -jar app.jar</code>.',
          '<b>Apache Ant</b> is a build tool driven by an XML file (<code>build.xml</code>). Targets like <code>compile</code>, <code>jar</code>, <code>run</code>, <code>clean</code> wrap <code>javac</code>, <code>jar</code>, etc. Run with <code>ant jar</code>.'
        ],
        analogy: 'A JAR is a sealed lunchbox with a label that says "open here" (the Main-Class) — the JVM unpacks and starts from that label. Ant is a kitchen recipe book: each page (target) lists steps to compile, package, or run the dish.',
        code: `# Build JAR with Main-Class:
jar cfe app.jar com.quest.Main -C out .

# Run it:
java -jar app.jar

<!-- build.xml (Ant) -->
<project name="quest" default="jar">
  <target name="compile">
    <javac srcdir="src" destdir="out"/>
  </target>
  <target name="jar" depends="compile">
    <jar destfile="app.jar" basedir="out">
      <manifest><attribute name="Main-Class" value="com.quest.Main"/></manifest>
    </jar>
  </target>
</project>`
      }
    ],
    exercises: [
      { q: 'Create a thread by extending <code>Thread</code>.', a: 'class T extends Thread { public void run(){ /* work */ } } new T().start();' },
      { q: 'Make <code>inc()</code> thread-safe.', a: 'public synchronized void inc(){ count++; }' },
      { q: 'Run an executable jar <code>app.jar</code>.', a: 'java -jar app.jar' }
    ]
  }
];

// Expose globally
window.MISSIONS = MISSIONS;
