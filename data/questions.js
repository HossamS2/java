/* =========================================================
   questions.js — JAVA QUEST Question Bank
   ---------------------------------------------------------
   IMPORTANT (transparency):
   The project prompt listed question SOURCES and TYPES but did NOT
   paste the actual examination questions. Per the rule
   "Do not invent missing original examination questions", every
   question below is flagged original:false and is a clearly-labelled
   PRACTICE question modelled on the listed exam style. When real
   original exam questions are supplied later, drop them in with
   original:true and they will be auto-tagged "⭐ ORIGINAL" in the UI.

   Sources covered:
     Sheet 1, Sheet 2, Lab 1, Lab 2, Lab 3, Lab 4,
     Methods Problems, Midterm 2024/2025, Midterm 2025/2026,
     Final 2024/2025, Final 2025/2026

   Types: mcq, tf, predict, debug, complete, write, explain,
          oopScenario, arrayProblem, recursionProblem
   Difficulties: easy, medium, hard
   ========================================================= */

const QUESTIONS = [

  /* ============== MISSION 1 — JAVA FOUNDATION ============== */

  { id:'q001', source:'sheet1', category:'foundation', type:'mcq', difficulty:'easy', original:false,
    question:'Which component executes Java bytecode?',
    options:['JDK','JRE','JVM','Compiler'], answer:2,
    explanation:'The JVM (Java Virtual Machine) executes the .class bytecode. The JDK contains development tools; the JRE contains the JVM + libraries; the compiler (javac) produces bytecode.',
    explanationAr:'الـ JVM هو الذي ينفذ الـ bytecode المُنتَج من ملف .class. الـ JDK يحوي أدوات التطوير، والـ JRE يحوي JVM والمكتبات، والمترجم javac ينتج الـ bytecode.' },

  { id:'q002', source:'sheet1', category:'foundation', type:'mcq', difficulty:'easy', original:false,
    question:'What is the output of the following code?',
    code:'System.out.println(7 / 2);',
    options:['3.5','3','3.0','0'], answer:1,
    explanation:'7 and 2 are both ints, so integer division is performed: 7/2 = 3 (the fractional part is truncated, not rounded). To get 3.5 use 7.0/2 or (double)7/2.',
    explanationAr:'بما أن 7 و 2 من نوع int، يتم تنفيذ قسمة صحيحة فتكون النتيجة 3 (تُقطع الكسور ولا تُقرّب). للحصول على 3.5 استخدم 7.0/2 أو (double)7/2.' },

  { id:'q003', source:'sheet1', category:'foundation', type:'mcq', difficulty:'easy', original:false,
    question:'Which keyword makes a variable a constant?',
    options:['static','final','const','let'], answer:1,
    explanation:'The final keyword makes a variable a constant — it can be assigned only once. Java has no const keyword (it is reserved but unused). Constants are conventionally named UPPER_SNAKE_CASE.',
    explanationAr:'الكلمة final تجعل المتغير ثابتًا لا يمكن تغييره بعد تعيينه مرة واحدة. Java لا تستخدم const (محجوزة لكن غير مستخدمة).' },

  { id:'q004', source:'sheet2', category:'foundation', type:'tf', difficulty:'easy', original:false,
    question:'In Java, the file name must match the name of the public class it contains.',
    options:['True','False'], answer:0,
    explanation:'True. A public class must live in a file with exactly the same name plus .java. This is how javac finds and names the resulting .class file.',
    explanationAr:'صحيح. يجب أن يكون اسم الملف مطابقًا تمامًا لاسم الـ public class مع امتداد .java.' },

  { id:'q005', source:'lab1', category:'foundation', type:'complete', difficulty:'easy', original:false,
    question:'Complete the line to read an integer from a Scanner object sc:',
    code:'Scanner sc = new Scanner(System.in);\nint n = ______;',
    options:['sc.nextInt()','sc.read()','sc.input()','sc.get(int)'], answer:0,
    explanation:'Scanner.nextInt() reads the next integer token from input. nextDouble() reads a double, nextLine() reads a whole line, next() reads one word.',
    explanationAr:'الدالة nextInt() تقرأ العدد الصحيح التالي من الإدخال.' },

  { id:'q006', source:'lab1', category:'foundation', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'int a = 5;\ndouble b = a;\nSystem.out.println(b);',
    options:['5','5.0','5.5','Error'], answer:1,
    explanation:'This is a widening (implicit) cast from int to double. 5 becomes 5.0 when stored/print as a double. No data is lost.',
    explanationAr:'تحويل توسيعي تلقائي من int إلى double، فيصبح 5 مساويًا 5.0.' },

  { id:'q007', source:'sheet2', category:'foundation', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'int x = 5;\nSystem.out.println(x++ + ++x);',
    options:['11','12','10','13'], answer:1,
    explanation:'x++ (postfix) uses current value 5, then x becomes 6. ++x (prefix) increments x to 7 first, then uses 7. So 5 + 7 = 12.',
    explanationAr:'x++ تستخدم القيمة الحالية 5 ثم تزيد x إلى 6. ++x تزيد x إلى 7 أولًا ثم تستخدم 7. فيصبح 5+7=12.' },

  { id:'q008', source:'lab1', category:'foundation', type:'debug', difficulty:'medium', original:false,
    question:'Find the bug:',
    code:'String s = "Java";\nif (s == "Java") {\n    System.out.println("match");\n}',
    options:['No bug — works correctly','== compares references; should use s.equals("Java")','Missing semicolon','String must be char'],'answer':1,
    explanation:'== compares object references, not content. Two "Java" literals may happen to share a reference due to string pooling, but this is not guaranteed for new String(...) or runtime input. Always use .equals() to compare String content.',
    explanationAr:'== يقارن المراجع وليس المحتوى. يجب استخدام .equals() لمقارنة محتوى النصوص.' },

  { id:'q009', source:'midterm2024', category:'foundation', type:'mcq', difficulty:'medium', original:false,
    question:'Which is NOT a primitive type in Java?',
    options:['int','boolean','String','char'], answer:2,
    explanation:'String is a class (reference type), not a primitive. The 8 primitives are byte, short, int, long, float, double, char, boolean.',
    explanationAr:'String هو class (نوع مرجعي) وليس primitive. الأنواع الـ primitive الثمانية هي: byte, short, int, long, float, double, char, boolean.' },

  { id:'q010', source:'sheet1', category:'foundation', type:'mcq', difficulty:'easy', original:false,
    question:'What is the size of an int in Java?',
    options:['16 bits','32 bits','64 bits','Depends on OS'], answer:1,
    explanation:'Java int is always 32 bits signed regardless of the operating system — this is part of what makes Java platform-independent. long is 64 bits, short is 16 bits, byte is 8 bits.',
    explanationAr:'int في Java دائمًا 32 بت بصرف النظر عن نظام التشغيل، وهذا جزء من استقلالية المنصة.' },

  { id:'q011', source:'lab1', category:'foundation', type:'explain', difficulty:'medium', original:false,
    question:'Explain why Java is called a "platform-independent" language.',
    reference:'Java source is compiled by javac into bytecode (.class), which is not tied to any CPU/OS. The JVM on each target platform interprets (or JIT-compiles) that same bytecode. So the same .class runs on Windows, Linux and macOS as long as a JVM is installed. The slogan is "Write Once, Run Anywhere".',
    explanation:'Platform independence comes from the bytecode + JVM layer: compile once, run on any JVM.',
    explanationAr:'يُترجم كود Java إلى bytecode غير مرتبط بنظام معين، ويقوم JVM على كل منصة بتنفيذه، فيعمل نفس ملف .class على ويندوز ولينكس وماك.' },

  { id:'q012', source:'sheet2', category:'foundation', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'double d = 9.99;\nint i = (int) d;\nSystem.out.println(i);',
    options:['9','10','9.99','Error'], answer:0,
    explanation:'Casting a double to int truncates (cuts off) the decimal part — it does NOT round. 9.99 becomes 9. To round use Math.round(d).',
    explanationAr:'التحويل من double إلى int يقطع الجزء العشري ولا يقرّب. 9.99 تصبح 9. للتقريب استخدم Math.round().' },

  { id:'q013', source:'lab1', category:'foundation', type:'write', difficulty:'easy', original:false,
    question:'Write a complete Java program that reads a user\'s name and age using Scanner, then prints: "Hello NAME, you are AGE years old."',
    reference:'import java.util.Scanner;\npublic class Greet {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.print("Name: ");\n        String name = sc.nextLine();\n        System.out.print("Age: ");\n        int age = sc.nextInt();\n        System.out.println("Hello " + name + ", you are " + age + " years old.");\n    }\n}',
    explanation:'Use nextLine() for a full name and nextInt() for the age, then concatenate with +.',
    explanationAr:'استخدم nextLine() للاسم الكامل و nextInt() للعمر، ثم ادمج النص بـ +.' },

  { id:'q014', source:'midterm2025', category:'foundation', type:'mcq', difficulty:'medium', original:false,
    question:'Which statement about the main method signature is correct?',
    options:['public void main(String args)','public static void main(String[] args)','public static int main(String[] a)','static public main()'],'answer':1,
    explanation:'The canonical signature is public static void main(String[] args). public so the JVM can call it; static so no instance is needed; void because it returns nothing; String[] args for command-line arguments. The array form may also be String... args.',
    explanationAr:'التوقيع الصحيح: public static void main(String[] args). الوسائط يمكن أن تكون أيضًا String... args.' },

  { id:'q015', source:'sheet1', category:'foundation', type:'predict', difficulty:'hard', original:false,
    question:'Predict the output:',
    code:'int a = 10, b = 20;\nboolean r = (a > b) || (b++ > 15);\nSystem.out.println(b);',
    options:['20','21','19','Error'], answer:1,
    explanation:'Short-circuit: a>b (10>20) is false, so || evaluates the right side: b++ > 15 uses b=20 (true), then b is incremented to 21. So b becomes 21.',
    explanationAr:'بسبب القصر: a>b خاطئة، فيُقيَّم الطرف الأيمن b++>15 باستخدام b=20 (صحيح) ثم تُزداد b إلى 21.' },

  /* ============== MISSION 2 — CONTROL FLOW ============== */

  { id:'q016', source:'sheet1', category:'controlflow', type:'mcq', difficulty:'easy', original:false,
    question:'Which loop guarantees its body runs at least once?',
    options:['for','while','do-while','for-each'], answer:2,
    explanation:'do-while checks the condition AFTER the first iteration, so the body always executes at least once even if the condition is initially false.',
    explanationAr:'do-while يفحص الشرط بعد أول دورة، لذا يُنفَّذ الجسم مرة واحدة على الأقل حتى لو كان الشرط خاطئًا منذ البداية.' },

  { id:'q017', source:'sheet1', category:'controlflow', type:'predict', difficulty:'easy', original:false,
    question:'Predict the output:',
    code:'for (int i = 0; i < 5; i++) {\n    if (i == 2) continue;\n    System.out.print(i + " ");\n}',
    options:['0 1 2 3 4','0 1 3 4','0 1 3 4 ','2'],'answer':2,
    explanation:'continue skips the rest of the body when i==2, so 2 is not printed. The space after 4 is from the last printed "4 ". Result: "0 1 3 4 ".',
    explanationAr:'continue يتخطى باقي الجسم عندما i==2، فلا تُطبع 2. الناتج: 0 1 3 4 بمسافة.' },

  { id:'q018', source:'lab2', category:'controlflow', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output of the switch:',
    code:'int day = 2;\nswitch (day) {\n  case 1: System.out.print("Mon ");\n  case 2: System.out.print("Tue ");\n  case 3: System.out.print("Wed ");\n  default: System.out.print("Day ");\n}',
    options:['Tue','Tue Wed Day','Tue Day','Mon Tue Wed Day'],'answer':1,
    explanation:'No break statements, so execution falls through from case 2 onward: prints "Tue Wed Day". This "fall-through" behavior is a classic switch pitfall.',
    explanationAr:'بسبب عدم وجود break، يستمر التنفيذ (fall-through) من case 2 حتى النهاية: Tue Wed Day.' },

  { id:'q019', source:'sheet2', category:'controlflow', type:'mcq', difficulty:'easy', original:false,
    question:'What does the break statement do inside a loop?',
    options:['Skips one iteration','Exits the loop immediately','Pauses the loop','Restarts the loop'], answer:1,
    explanation:'break immediately terminates the nearest enclosing loop or switch. continue only skips the current iteration.',
    explanationAr:'break تنهي الحلقة (أو switch) فورًا، بينما continue تتخطى الدورة الحالية فقط.' },

  { id:'q020', source:'midterm2024', category:'controlflow', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'int i = 0;\nwhile (i < 10) {\n    i += 3;\n}\nSystem.out.println(i);',
    options:['9','10','12','Error'], answer:2,
    explanation:'i goes 3, 6, 9, 12. When i=12 the condition i<10 is false and the loop stops. i is printed as 12.',
    explanationAr:'i تتزايد: 3, 6, 9, 12. عند i=12 يصبح الشرط خاطئًا، وتُطبع 12.' },

  { id:'q021', source:'lab2', category:'controlflow', type:'complete', difficulty:'medium', original:false,
    question:'Complete the code to print only even numbers from 1 to 10:',
    code:'for (int i = 1; i <= 10; i++) {\n    if (i % 2 ____ 0) System.out.println(i);\n}',
    options:['==','!=','>','<'], answer:0,
    explanation:'i % 2 == 0 is true for even numbers. Alternatively use i % 2 != 0 with continue.',
    explanationAr:'i % 2 == 0 صحيح للأرقام الزوجية.' },

  { id:'q022', source:'sheet1', category:'controlflow', type:'write', difficulty:'medium', original:false,
    question:'Write a for-loop that prints a 4-line right triangle of stars:\n*\n**\n***\n****',
    reference:'for (int i = 1; i <= 4; i++) {\n    for (int j = 1; j <= i; j++) {\n        System.out.print("*");\n    }\n    System.out.println();\n}',
    explanation:'Outer loop controls the row count; inner loop prints i stars per row; println ends each row.',
    explanationAr:'الحلقة الخارجية للصفوف، والداخلية تطبع i نجوم لكل صف، ثم println لإنهاء السطر.' },

  { id:'q023', source:'lab2', category:'controlflow', type:'debug', difficulty:'medium', original:false,
    question:'This loop should print 1..5 but prints nothing. Find the bug:',
    code:'for (int i = 5; i < 5; i++) {\n    System.out.println(i);\n}',
    options:['Should be i <= 5','Should be i > 0','Missing break','i must be double'],'answer':0,
    explanation:'The condition i < 5 is false immediately because i starts at 5. Change to i <= 5 to run from 5 to 5, or start i at 1 with i <= 5.',
    explanationAr:'الشرط i<5 خاطئ منذ البداية لأن i تبدأ من 5. يجب تغييره إلى i<=5 (أو بدء i من 1).' },

  { id:'q024', source:'final2024', category:'controlflow', type:'predict', difficulty:'hard', original:false,
    question:'Predict the output:',
    code:'int count = 0;\nouter:\nfor (int i = 0; i < 3; i++) {\n  for (int j = 0; j < 3; j++) {\n    if (i == j) break outer;\n    count++;\n  }\n}\nSystem.out.println(count);',
    options:['0','1','2','3'], answer:0,
    explanation:'First iteration: i=0, j=0 → i==j → break outer (labeled break exits BOTH loops immediately). count is never incremented. Output: 0.',
    explanationAr:'أول دورة: i=0, j=0 → i==j → break outer تخرج من الحلقتين معًا. لا تزيد count. الناتج 0.' },

  { id:'q025', source:'sheet2', category:'controlflow', type:'mcq', difficulty:'medium', original:false,
    question:'Convert: for (int i=0;i<3;i++) print(i); to a while loop. Which is correct?',
    options:['int i=0; while(i<3){print(i); i++;}','while(i<3){print(i); i++;} int i=0;','int i=0; while(i<3) print(i); i++;','int i; while(i<3){i++; print(i);}'],'answer':0,
    explanation:'Move init before the loop, keep the condition, and put the update inside the body. Order: init → while(cond){body; update}.',
    explanationAr:'انقل التهيئة قبل الحلقة، أبقِ الشرط، وضع التحديث داخل الجسم.' },

  { id:'q026', source:'lab2', category:'controlflow', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'int n = 17;\nString parity = (n % 2 == 0) ? "even" : "odd";\nSystem.out.println(parity);',
    options:['even','odd','Error','17'],'answer':1,
    explanation:'17 % 2 == 1, so the ternary picks the false branch "odd".',
    explanationAr:'17 % 2 == 1، فيختار المعامل الثلاثي الفرع الخاطئ "odd".' },

  { id:'q027', source:'midterm2025', category:'controlflow', type:'explain', difficulty:'medium', original:false,
    question:'Explain the difference between break and continue.',
    reference:'break immediately exits the nearest enclosing loop or switch — no further iterations run. continue skips the remaining statements of the current iteration and jumps to the next iteration\'s condition check. break ends the loop; continue keeps it going but skips one pass.',
    explanation:'break = exit loop; continue = skip this iteration only.',
    explanationAr:'break تخرج من الحلقة فورًا. continue تتخطى الدورة الحالية فقط وتنتقل إلى التكرار التالي.' },

  /* ============== MISSION 3 — ARRAYS ============== */

  { id:'q028', source:'sheet1', category:'arrays', type:'mcq', difficulty:'easy', original:false,
    question:'What is the index of the first element in a Java array?',
    options:['1','0','-1','Depends on type'], answer:1,
    explanation:'Java arrays are zero-indexed: the first element is at index 0, the last at length-1.',
    explanationAr:'مصفوفات Java تبدأ من الفهرس 0، والعنصر الأخير عند length-1.' },

  { id:'q029', source:'sheet1', category:'arrays', type:'predict', difficulty:'easy', original:false,
    question:'Predict the output:',
    code:'int[] a = {10, 20, 30};\nSystem.out.println(a.length);',
    options:['2','3','4','Error'],'answer':1,
    explanation:'length is a field (not a method) on arrays, returning the number of elements: 3.',
    explanationAr:'length حقل وليس دالة، يعطي عدد العناصر: 3.' },

  { id:'q030', source:'lab3', category:'arrays', type:'arrayProblem', difficulty:'easy', original:false,
    question:'What is the maximum value in {5, 2, 9, 1, 7}?',
    options:['5','7','9','1'], answer:2,
    explanation:'Walk the array tracking the largest seen so far: 5 → 9 → 9. Maximum is 9. Always start max at the first element, not 0, to handle all-negative arrays.',
    explanationAr:'امشِ المصفوفة متتبعًا أكبر قيمة: 5 → 9. الأقصى هو 9. ابدأ من العنصر الأول لا من 0.' },

  { id:'q031', source:'lab3', category:'arrays', type:'arrayProblem', difficulty:'medium', original:false,
    question:'What is the sum of {3, 1, 4, 1, 5, 9, 2, 6}?',
    options:['30','31','29','28'], answer:1,
    explanation:'3+1+4+1+5+9+2+6 = 31. Accumulate in a loop or use a stream.',
    explanationAr:'المجموع = 31 (3+1+4+1+5+9+2+6).' },

  { id:'q032', source:'sheet2', category:'arrays', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'int[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 99;\nSystem.out.println(a[0]);',
    options:['1','99','Error','null'],'answer':1,
    explanation:'Arrays are reference types. b = a copies the reference, not the contents — both names point to the same array. Mutating b[0] also changes a[0].',
    explanationAr:'المصفوفات أنواع مرجعية. b=a ينسخ المرجع لا المحتوى، فيشير الاثنان لنفس المصفوفة. تغيير b[0] يغير a[0].' },

  { id:'q033', source:'lab3', category:'arrays', type:'debug', difficulty:'medium', original:false,
    question:'Find the bug:',
    code:'int[] arr = new int[5];\nfor (int i = 0; i <= arr.length; i++) {\n    arr[i] = i;\n}',
    options:['Should be i < arr.length','Should start at i=1','int[] wrong type','Missing new'],'answer':0,
    explanation:'i <= arr.length runs i=5 on the last iteration, but valid indexes are 0..4. This throws ArrayIndexOutOfBoundsException. Use i < arr.length.',
    explanationAr:'i<=arr.length يجعل i=5 في آخر دورة، والفهارس الصحيحة 0..4 فقط، ما يسبب ArrayIndexOutOfBoundsException. استخدم i<arr.length.' },

  { id:'q034', source:'lab3', category:'arrays', type:'complete', difficulty:'medium', original:false,
    question:'Complete the enhanced for-loop to sum the array:',
    code:'int[] nums = {2, 4, 6};\nint sum = 0;\nfor (int x : ______) {\n    sum += x;\n}',
    options:['nums','nums[i]','i','nums.length'],'answer':0,
    explanation:'The enhanced for-loop syntax is for (type var : array). Here: for (int x : nums). The loop variable x takes each value in turn.',
    explanationAr:'صيغة for-each: for (int x : nums)، حيث x يأخذ كل قيمة بدورها.' },

  { id:'q035', source:'lab3', category:'arrays', type:'arrayProblem', difficulty:'medium', original:false,
    question:'A 2D array is declared as int[][] m = new int[3][4]; How many total elements?',
    options:['7','12','3','4'],'answer':1,
    explanation:'3 rows × 4 columns = 12 elements. m.length is 3 (rows); m[0].length is 4 (columns).',
    explanationAr:'3 صفوف × 4 أعمدة = 12 عنصرًا. m.length = 3 (صفوف)، m[0].length = 4 (أعمدة).' },

  { id:'q036', source:'final2024', category:'arrays', type:'predict', difficulty:'hard', original:false,
    question:'Predict the output:',
    code:'int[][] g = {{1,2},{3,4,5},{6}};\nSystem.out.println(g[1].length + " " + g[2][0]);',
    options:['2 6','3 6','3 5','2 5'],'answer':1,
    explanation:'This is a jagged array: g[1] = {3,4,5} has length 3; g[2] = {6} and g[2][0] = 6. So "3 6".',
    explanationAr:'مصفوفة متعرّجة: g[1]={3,4,5} طولها 3، وg[2]={6} فيكون g[2][0]=6. الناتج "3 6".' },

  { id:'q037', source:'lab3', category:'arrays', type:'write', difficulty:'medium', original:false,
    question:'Write code to reverse the array {1,2,3,4,5} in place and print the result.',
    reference:'int[] a = {1,2,3,4,5};\nfor (int i = 0, j = a.length - 1; i < j; i++, j--) {\n    int t = a[i]; a[i] = a[j]; a[j] = t;\n}\nfor (int x : a) System.out.print(x + " ");  // 5 4 3 2 1',
    explanation:'Swap the pair at indices i and j, moving i forward and j backward until they meet in the middle.',
    explanationAr:'بدّل العنصرين عند i و j، حرك i للأمام و j للخلف حتى يلتقيا في المنتصف.' },

  { id:'q038', source:'sheet1', category:'arrays', type:'mcq', difficulty:'medium', original:false,
    question:'Which correctly declares a String ArrayList?',
    options:['ArrayList<String> list = new ArrayList<>();','ArrayList<String> list = new ArrayList<String>[];','String[] list = new ArrayList<>;','ArrayList list = "x";'],'answer':0,
    explanation:'Use generics on the left and the diamond <> on the right (Java 7+). ArrayList is resizable and lives in java.util.',
    explanationAr:'استخدم generics على اليسار و <> على اليمين. ArrayList حجمها متغير وتقع في java.util.' },

  { id:'q039', source:'lab3', category:'arrays', type:'arrayProblem', difficulty:'medium', original:false,
    question:'Linear search: in {4, 7, 2, 9, 5}, what index is the value 9?',
    options:['2','3','4','9'],'answer':1,
    explanation:'Scan left to right: index 0=4, 1=7, 2=2, 3=9 → found at index 3. Linear search is O(n).',
    explanationAr:'امسح من اليسار: 4, 7, 2, 9 عند الفهرس 3. البحث الخطي O(n).' },

  { id:'q040', source:'final2025', category:'arrays', type:'predict', difficulty:'hard', original:false,
    question:'Predict the output:',
    code:'int[] a = {1,2,3,4,5};\nint sum = 0;\nfor (int x : a) sum += x;\nSystem.out.println((double) sum / a.length);',
    options:['3.0','3','15','2.5'],'answer':0,
    explanation:'Sum = 15, length = 5. (double)15/5 = 3.0. The cast makes it floating-point division.',
    explanationAr:'المجموع 15، الطول 5، فيصبح (double)15/5 = 3.0.' },

  { id:'q041', source:'sheet2', category:'arrays', type:'mcq', difficulty:'easy', original:false,
    question:'What does ArrayList.add(x) do?',
    options:['Removes x','Appends x to the end','Reads x at index 0','Sorts the list'], answer:1,
    explanation:'add(x) appends x to the end of the list and grows the size by one. add(index, x) inserts at a position. size() returns the count; get(i) reads; remove(i) deletes.',
    explanationAr:'add(x) تضيف x في نهاية القائمة وتزيد الحجم بمقدار واحد.' },

  /* ============== MISSION 4 — METHODS & RECURSION ============== */

  { id:'q042', source:'sheet1', category:'methods', type:'mcq', difficulty:'easy', original:false,
    question:'A method declared with void:',
    options:['Returns an int','Returns nothing','Returns any type','Must be static'],'answer':1,
    explanation:'void means the method performs an action but returns no value. There is no return statement (or a bare return;).',
    explanationAr:'void تعني أن الدالة تنفذ عملًا لكنها لا تُرجع قيمة.' },

  { id:'q043', source:'methodsProblems', category:'methods', type:'recursionProblem', difficulty:'easy', original:false,
    question:'What is factorial(5)?',
    options:['20','25','120','720'],'answer':2,
    explanation:'5! = 5×4×3×2×1 = 120. Base case 0! = 1 or 1! = 1.',
    explanationAr:'5! = 5×4×3×2×1 = 120.' },

  { id:'q044', source:'methodsProblems', category:'methods', type:'recursionProblem', difficulty:'medium', original:false,
    question:'What is fib(6)? (fib(0)=0, fib(1)=1)',
    options:['5','8','13','21'],'answer':1,
    explanation:'Sequence: 0,1,1,2,3,5,8 — fib(6)=8. Naive recursion recomputes the same values exponentially; memoization makes it linear.',
    explanationAr:'المتتالية: 0,1,1,2,3,5,8 — fib(6)=8.' },

  { id:'q045', source:'lab4', category:'methods', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'int square(int x) { return x * x; }\n// in main:\nSystem.out.println(square(2 + 3));',
    options:['7','10','25','Error'],'answer':2,
    explanation:'2+3 = 5 is evaluated first, then passed as the argument. square(5) = 25. Java is pass-by-value: the value 5 is copied into parameter x.',
    explanationAr:'يُحسب 2+3=5 أولًا ثم يُمرَّر. square(5)=25.' },

  { id:'q046', source:'sheet2', category:'methods', type:'mcq', difficulty:'medium', original:false,
    question:'Which pair correctly overloads a method?',
    options:['int f(int a) and void f(int a)','int f(int a) and int f(int a, int b)','int f(int a) and int f(int a)','void f() and void f()'],'answer':1,
    explanation:'Overloading requires DIFFERENT parameter lists (number or type). Return type alone does not distinguish overloads. The pair int f(int) and int f(int,int) differs by parameter count → valid overload.',
    explanationAr:'يتطلب التحميل الزائد اختلاف قائمة المعاملات. نوع الإرجاع وحده لا يكفي. int f(int) و int f(int,int) تحميل زائد صحيح.' },

  { id:'q047', source:'methodsProblems', category:'methods', type:'recursionProblem', difficulty:'medium', original:false,
    question:'gcd(48, 18) using Euclid\'s algorithm = ?',
    options:['2','3','6','9'],'answer':2,
    explanation:'gcd(48,18) → gcd(18,12) → gcd(12,6) → gcd(6,0) → 6. Each step replaces (a,b) with (b, a%b) until b=0; then a is the GCD.',
    explanationAr:'gcd(48,18) → gcd(18,12) → gcd(12,6) → gcd(6,0) → 6.' },

  { id:'q048', source:'lab4', category:'methods', type:'predict', difficulty:'hard', original:false,
    question:'Predict the output:',
    code:'int f(int n) {\n  if (n <= 0) return 0;\n  return n + f(n - 1);\n}\n// main:\nSystem.out.println(f(4));',
    options:['4','10','6','24'],'answer':1,
    explanation:'f(4) = 4 + f(3) = 4 + 3 + f(2) = 4 + 3 + 2 + f(1) = 4 + 3 + 2 + 1 + f(0) = 4 + 3 + 2 + 1 + 0 = 10. This sums 1..n.',
    explanationAr:'f(4)=4+f(3)=4+3+f(2)=…=10. هذه الدالة تجمع 1..n.' },

  { id:'q049', source:'methodsProblems', category:'methods', type:'recursionProblem', difficulty:'medium', original:false,
    question:'A recursive method MUST have which to avoid infinite recursion?',
    options:['A loop','A base case','A static keyword','A return type'],'answer':1,
    explanation:'A base case is the condition that stops recursion. Without it, the method calls itself forever and the call stack overflows → StackOverflowError.',
    explanationAr:'الحالة الأساسية (base case) هي التي توقف العودية. بدونها تحدث StackOverflowError.' },

  { id:'q050', source:'sheet2', category:'methods', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'void swap(int a, int b) {\n  int t = a; a = b; b = t;\n}\n// main:\nint x = 1, y = 2;\nswap(x, y);\nSystem.out.println(x + " " + y);',
    options:['2 1','1 2','Error','null'],'answer':1,
    explanation:'Java is pass-by-value. The swap method gets copies of x and y; swapping the copies does NOT affect the caller\'s x and y. Output: 1 2.',
    explanationAr:'Java تمرر بالقيمة. الدالة swap تأخذ نسخًا من x و y، فتبديل النسخ لا يؤثر على الأصل. الناتج 1 2.' },

  { id:'q051', source:'midterm2024', category:'methods', type:'mcq', difficulty:'medium', original:false,
    question:'When a method calls itself, what concept is being used?',
    options:['Overloading','Recursion','Inheritance','Polymorphism'],'answer':1,
    explanation:'Recursion: a method invokes itself on a smaller subproblem. It requires a base case to terminate.',
    explanationAr:'العودية: الدالة تستدعي نفسها على مسألة أصغر، وتتطلب حالة أساسية للتوقف.' },

  { id:'q052', source:'lab4', category:'methods', type:'write', difficulty:'medium', original:false,
    question:'Write a recursive method int power(int base, int exp) that returns base^exp. Assume exp >= 0.',
    reference:'int power(int base, int exp) {\n    if (exp == 0) return 1;          // base case: anything^0 = 1\n    return base * power(base, exp - 1);\n}',
    explanation:'Base case exp==0 returns 1. Otherwise multiply base by power(base, exp-1). power(2,3) = 2*2*2 = 8.',
    explanationAr:'الحالة الأساسية exp==0 تُرجع 1. وإلا: base * power(base, exp-1).' },

  { id:'q053', source:'final2024', category:'methods', type:'predict', difficulty:'hard', original:false,
    question:'Predict the output:',
    code:'int calc(int n) {\n  if (n == 1) return 1;\n  return n * calc(n - 1);\n}\nSystem.out.println(calc(4));',
    options:['4','10','24','Error'],'answer':2,
    explanation:'calc(4) = 4 * calc(3) = 4*3*calc(2) = 4*3*2*calc(1) = 4*3*2*1 = 24. This is factorial.',
    explanationAr:'calc(4)=4*3*2*1=24 (مضروع 4).' },

  { id:'q054', source:'sheet1', category:'methods', type:'explain', difficulty:'medium', original:false,
    question:'Explain "Java is pass-by-value".',
    reference:'Java passes every argument by copying its value. For primitives, the value is the number/boolean itself, so changes inside the method do not affect the caller. For objects and arrays, the value copied is the reference (the address) — so the method can mutate the object\'s fields or array contents, but reassigning the parameter to a new object inside the method does NOT affect the caller\'s reference.',
    explanation:'Primitives: copy of value. Objects: copy of reference (can mutate contents, cannot reassign caller\'s variable).',
    explanationAr:'Java تمرر بالقيمة. للأنواع البدائية تُنسخ القيمة. للكائنات يُنسخ المرجع، فيمكن تعديل المحتوى لكن لا يمكن إعادة تعيين متغير المُستدعي.' },

  { id:'q055', source:'methodsProblems', category:'methods', type:'recursionProblem', difficulty:'hard', original:false,
    question:'Recursive sum of digits of 1234 (returns 1+2+3+4)?',
    options:['6','10','24','1234'],'answer':1,
    explanation:'sumDig(1234) = 4 + sumDig(123) = 4 + 3 + sumDig(12) = 4+3+2+sumDig(1) = 4+3+2+1 = 10. Base case: n < 10 returns n.',
    explanationAr:'sumDig(1234) = 4 + 3 + 2 + 1 = 10.' },

  /* ============== MISSION 5 — OOP CITY (most detailed) ============== */

  { id:'q056', source:'sheet1', category:'oop', type:'mcq', difficulty:'easy', original:false,
    question:'What is an object?',
    options:['A blueprint','A variable type only','An instance of a class','A method'],'answer':2,
    explanation:'An object is a concrete instance created from a class via new. The class is the blueprint; the object is the actual thing built from it, with its own state.',
    explanationAr:'الكائن نسخة فعلية تُنشأ من الـ class باستخدام new. الـ class هو المخطط والكائن هو الشيء المبني.' },

  { id:'q057', source:'sheet1', category:'oop', type:'mcq', difficulty:'easy', original:false,
    question:'Which keyword creates a new object?',
    options:['create','new','make','init'],'answer':1,
    explanation:'new allocates memory for the object and calls its constructor to initialize it. Example: Student s = new Student();',
    explanationAr:'new تخصص الذاكرة للكائن وتستدعي الـ constructor لتهيئته.' },

  { id:'q058', source:'lab4', category:'oop', type:'predict', difficulty:'easy', original:false,
    question:'Predict the output:',
    code:'class A { int x; }\n// main:\nA a = new A();\na.x = 7;\nSystem.out.println(a.x);',
    options:['0','7','null','Error'],'answer':1,
    explanation:'new A() creates an object with x defaulting to 0. Then a.x = 7 sets the field. Printing a.x gives 7.',
    explanationAr:'new A() ينشئ كائنًا بـ x=0 افتراضيًا، ثم a.x=7، فتُطبع 7.' },

  { id:'q059', source:'sheet2', category:'oop', type:'oopScenario', difficulty:'medium', original:false,
    question:'You want to prevent outsiders from changing a Student\'s gpa field directly. Which approach?',
    options:['Make gpa public','Make gpa private and provide setGpa with validation','Make gpa static','Use a local variable'],'answer':1,
    explanation:'This is encapsulation: make the field private and expose a setter that validates the value (e.g., reject negatives or values > 4.0). Getters expose read access.',
    explanationAr:'هذا هو التغليف: اجعل الحقل private ووفّر setter يتحقق من القيمة، مع getter للقراءة.' },

  { id:'q060', source:'lab4', category:'oop', type:'mcq', difficulty:'medium', original:false,
    question:'A constructor differs from a regular method in that:',
    options:['It has a return type','It has the same name as the class and no return type','It must be static','It cannot take parameters'],'answer':1,
    explanation:'A constructor shares the class name, has no return type (not even void), and runs once via new. It may be overloaded and take parameters.',
    explanationAr:'الـ constructor يحمل اسم الـ class، وليس له نوع إرجاع، ويُستدعى مرة واحدة عبر new، ويمكن تحميله زائدًا.' },

  { id:'q061', source:'midterm2024', category:'oop', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'class Box {\n  int size;\n  Box() { size = 1; }\n  Box(int s) { size = s; }\n}\n// main:\nBox b = new Box(5);\nSystem.out.println(b.size);',
    options:['0','1','5','Error'],'answer':2,
    explanation:'new Box(5) calls the parameterized constructor Box(int s), setting size=5. Output: 5. The no-arg Box() is not called.',
    explanationAr:'new Box(5) يستدعي الـ constructor ذا المعامل، فيصبح size=5.' },

  { id:'q062', source:'sheet1', category:'oop', type:'mcq', difficulty:'easy', original:false,
    question:'The keyword "this" refers to:',
    options:['The parent class','The current object','A static variable','The constructor'],'answer':1,
    explanation:'this is an implicit reference to the current object inside an instance method or constructor. Used to access fields shadowed by parameters, or to call another constructor with this(...).',
    explanationAr:'this يشير إلى الكائن الحالي داخل دالة أو constructor، ويُستخدم لتمييز الحقول التي تحجبها المعاملات.' },

  { id:'q063', source:'sheet2', category:'oop', type:'mcq', difficulty:'medium', original:false,
    question:'Which access modifier allows access only within the same class?',
    options:['public','protected','default','private'],'answer':3,
    explanation:'private = same class only. default (no modifier) = same package. protected = package + subclasses. public = anywhere.',
    explanationAr:'private = داخل الـ class فقط. default = نفس الحزمة. protected = الحزمة + الفئات الفرعية. public = في أي مكان.' },

  { id:'q064', source:'lab4', category:'oop', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'class Counter {\n  static int n = 0;\n  Counter() { n++; }\n}\n// main:\nnew Counter();\nnew Counter();\nSystem.out.println(Counter.n);',
    options:['0','1','2','Error'],'answer':2,
    explanation:'n is static (shared by all instances). Each constructor call increments n: after two new Counter() calls, n = 2. Access via Counter.n.',
    explanationAr:'n ثابت (مشترك). كل استدعاء constructor يزيد n: بعد اثنين تصبح n=2.' },

  { id:'q065', source:'sheet1', category:'oop', type:'mcq', difficulty:'medium', original:false,
    question:'Which keyword implements inheritance in Java?',
    options:['implements','extends','inherits','super'],'answer':1,
    explanation:'extends creates a subclass from a superclass: class Dog extends Animal. Java allows single class inheritance. implements is for interfaces.',
    explanationAr:'extends تنشئ فئة فرعية من فئة أساسية. implements للـ interfaces.' },

  { id:'q066', source:'midterm2025', category:'oop', type:'predict', difficulty:'hard', original:false,
    question:'Predict the output:',
    code:'class Animal { void speak() { System.out.println("..."); } }\nclass Dog extends Animal { void speak() { System.out.println("Woof"); } }\n// main:\nAnimal a = new Dog();\na.speak();',
    options:['...','Woof','Error','Nothing'],'answer':1,
    explanation:'This is polymorphism + dynamic dispatch. The reference type is Animal but the actual object is Dog. At runtime the JVM calls Dog\'s overridden speak(): "Woof".',
    explanationAr:'تعدد الأشكال + الإرسال الديناميكي. نوع المرجع Animal لكن الكائن فعليًا Dog، فيستدعي JVM نسخة Dog: "Woof".' },

  { id:'q067', source:'sheet2', category:'oop', type:'mcq', difficulty:'medium', original:false,
    question:'Overriding differs from overloading because overriding:',
    options:['Happens at compile time','Involves the same method name in the same class','Redefines a parent method in a subclass with the same signature','Changes the parameter list'],'answer':2,
    explanation:'Overriding = subclass redefines an inherited method with the SAME signature (resolved at runtime, dynamic dispatch). Overloading = same name, different parameters, in the same class (resolved at compile time).',
    explanationAr:'التجاوز: الفئة الفرعية تعيد تعريف دالة موروثة بنفس التوقيع (وقت التشغيل). التحميل الزائد: نفس الاسم ومعاملات مختلفة في نفس الفئة (وقت الترجمة).' },

  { id:'q068', source:'final2024', category:'oop', type:'predict', difficulty:'hard', original:false,
    question:'Predict the output:',
    code:'class P { void f() { System.out.println("P"); } }\nclass C extends P { void f() { System.out.println("C"); } }\n// main:\nP obj = new C();\nobj.f();',
    options:['P','C','PC','Error'],'answer':1,
    explanation:'Dynamic dispatch: the actual object is C, so C.f() runs. Output: "C". The reference type P only matters at compile time for which methods are visible.',
    explanationAr:'الإرسال الديناميكي: الكائن الفعلي C، فيُستدعى C.f(). الناتج "C".' },

  { id:'q069', source:'sheet1', category:'oop', type:'mcq', difficulty:'medium', original:false,
    question:'An abstract class:',
    options:['Can be instantiated directly','Cannot be instantiated and may contain abstract methods','Cannot have any concrete methods','Must implement an interface'],'answer':1,
    explanation:'An abstract class cannot be instantiated with new. It may have abstract methods (no body) that subclasses must implement, plus concrete methods and fields.',
    explanationAr:'لا يمكن إنشاء فئة abstract بـ new، وقد تحتوي على دوال abstract يجب على الفئات الفرعية تنفيذها، مع دوال وحقول ملموسة.' },

  { id:'q070', source:'sheet2', category:'oop', type:'mcq', difficulty:'medium', original:false,
    question:'A class can in Java:',
    options:['Extend multiple classes','Implement multiple interfaces','Both extend multiple classes and implement multiple interfaces','Neither'],'answer':1,
    explanation:'Java allows SINGLE class inheritance (one extends) but MULTIPLE interface implementation. This avoids the diamond problem of multiple inheritance of state.',
    explanationAr:'Java تسمح بوراثة فئة واحدة فقط (extends) لكن تنفيذ عدة interfaces، لتجنب مشكلة الوراثة المتعددة للحالة.' },

  { id:'q071', source:'lab4', category:'oop', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'class A {\n  A() { System.out.println("A"); }\n}\nclass B extends A {\n  B() { System.out.println("B"); }\n}\n// main:\nnew B();',
    options:['B','A','A B','B A'],'answer':2,
    explanation:'A subclass constructor\'s first implicit action is calling super() (the parent\'s no-arg constructor). So A\'s constructor runs first, then B\'s: "A B".',
    explanationAr:'أول ما يفعله constructor الفئة الفرعية هو استدعاء super() للفئة الأساسية ضمنيًا. فيُطبع "A" ثم "B".' },

  { id:'q072', source:'midterm2024', category:'oop', type:'oopScenario', difficulty:'medium', original:false,
    question:'You want to define a "Drawable" capability shared by unrelated classes Circle, Photo, and Button. Best choice?',
    options:['An abstract class Drawable','An interface Drawable','A static method','A final class'],'answer':1,
    explanation:'An interface defines a capability without forcing a shared class hierarchy. Circle, Photo, Button can all implement Drawable even though they are unrelated. An abstract class would force them to share a single parent.',
    explanationAr:'الـ interface يعرّف قدرة دون إجبار تسلسل وراثي مشترك، فيمكن لـ Circle و Photo و Button تنفيذ Drawable رغم اختلافهم.' },

  { id:'q073', source:'sheet1', category:'oop', type:'mcq', difficulty:'medium', original:false,
    question:'The keyword "super" is used to:',
    options:['Call the current object\'s method','Refer to a static field','Call the parent class\'s constructor or methods','Create a new object'],'answer':2,
    explanation:'super refers to the parent class. super() calls the parent constructor (must be the first line). super.method() calls an overridden parent method.',
    explanationAr:'super يشير للفئة الأساسية. super() يستدعي constructor الأب، و super.method() يستدعي دالة أب تم تجاوزها.' },

  { id:'q074', source:'final2025', category:'oop', type:'predict', difficulty:'hard', original:false,
    question:'Predict the output:',
    code:'class Shape { double area() { return 0; } }\nclass Rect extends Shape {\n  double w, h;\n  double area() { return w * h; }\n}\n// main (assume w=2, h=3):\nShape s = new Rect();\ns.w = 2; s.h = 3;\nSystem.out.println(s.area());',
    options:['0','6','Error','6.0'],'answer':2,
    explanation:'COMPILE ERROR: the reference type is Shape, which has no fields w or h. Even though the actual object is a Rect, the compiler only sees Shape\'s API. To set w/h you must declare the variable as Rect, or add setters to Shape.',
    explanationAr:'خطأ ترجمة: نوع المرجع Shape لا يحوي الحقلين w و h. حتى لو كان الكائن فعليًا Rect، المترجم يرى واجهة Shape فقط. يجب تعريف المتغير Rect أو إضافة setters لـ Shape.' },

  { id:'q075', source:'sheet2', category:'oop', type:'mcq', difficulty:'easy', original:false,
    question:'Garbage collection in Java:',
    options:['Must be done manually by the programmer','Happens automatically for unreachable objects','Is done with the delete keyword','Only runs at program exit'],'answer':1,
    explanation:'The JVM automatically reclaims memory of objects no longer referenced (unreachable). You do not (and should not) manually free memory. System.gc() is a hint, not a guarantee.',
    explanationAr:'JVM يحرر ذاكرة الكائنات غير القابلة للوصول تلقائيًا. لا تُحرّر الذاكرة يدويًا. System.gc() مجرد تلميح غير مضمون.' },

  { id:'q076', source:'lab4', category:'oop', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'String a = new String("hi");\nString b = new String("hi");\nSystem.out.println((a == b) + " " + a.equals(b));',
    options:['true true','false false','false true','true false'],'answer':2,
    explanation:'new String creates a fresh object each time, so a and b are different references → a == b is false. But their content is the same → a.equals(b) is true. Always use .equals() for String content comparison.',
    explanationAr:'new String ينشئ كائنًا جديدًا في كل مرة، فالمراجع مختلفة (== false) لكن المحتوى متطابق (equals true).' },

  { id:'q077', source:'midterm2025', category:'oop', type:'mcq', difficulty:'medium', original:false,
    question:'A final class:',
    options:['Can be subclassed','Cannot be subclassed','Cannot have methods','Must be abstract'],'answer':1,
    explanation:'A final class cannot be extended (e.g., String, Integer). final on a method prevents overriding; final on a variable makes it a constant.',
    explanationAr:'الفئة final لا يمكن وراثتها (مثل String). final على الدالة تمنع التجاوز، وعلى المتغير تجعله ثابتًا.' },

  { id:'q078', source:'sheet1', category:'oop', type:'mcq', difficulty:'medium', original:false,
    question:'A package in Java is used to:',
    options:['Group related classes and avoid name conflicts','Compile the program','Run threads','Define constants'],'answer':0,
    explanation:'A package is a namespace that groups related classes and prevents name collisions. Declared at the top of a file: package com.quest.oop;',
    explanationAr:'الحزمة تجمع الفئات ذات الصلة وتمنع تعارض الأسماء. تُعلن في أعلى الملف: package com.quest.oop;' },

  { id:'q079', source:'lab4', category:'oop', type:'write', difficulty:'hard', original:false,
    question:'Write a complete encapsulated class BankAccount with: a private double balance; a constructor that takes an initial balance (rejecting negatives, defaulting to 0); deposit(double) that rejects negatives; withdraw(double) that rejects negatives and overdrafts; and getBalance().',
    reference:'public class BankAccount {\n    private double balance;\n    public BankAccount(double initial) {\n        balance = (initial >= 0) ? initial : 0;\n    }\n    public void deposit(double amt) {\n        if (amt > 0) balance += amt;\n    }\n    public void withdraw(double amt) {\n        if (amt > 0 && amt <= balance) balance -= amt;\n    }\n    public double getBalance() { return balance; }\n}',
    explanation:'Encapsulation: balance is private, all access goes through validated methods. Constructor and mutators guard invariants.',
    explanationAr:'التغليف: balance خاصة وكل الوصول عبر دوال تتحقق من الشروط.' },

  { id:'q080', source:'final2024', category:'oop', type:'oopScenario', difficulty:'hard', original:false,
    question:'Given: abstract class Shape { abstract double area(); } and class Circle extends Shape. Which line correctly instantiates a Circle?',
    options:['Shape s = new Shape();','Shape s = new Circle();','Circle c = new Shape();','abstract Shape s = new Circle();'],'answer':1,
    explanation:'You cannot instantiate an abstract class (new Shape() is illegal), but you CAN hold a subclass instance in a parent-type reference: Shape s = new Circle();. This is the standard polymorphic pattern.',
    explanationAr:'لا يمكن إنشاء فئة abstract، لكن يمكن إمساك نسخة من فئة فرعية في مرجع من نوع الأب: Shape s = new Circle();' },

  { id:'q081', source:'midterm2024', category:'oop', type:'explain', difficulty:'medium', original:false,
    question:'Explain polymorphism with a one-line definition and a concrete example.',
    reference:'Polymorphism = one reference type, many runtime forms. Example: Animal a = new Dog(); a.speak(); — the variable is typed Animal but at runtime Dog.speak() runs because of dynamic dispatch. The same line of code can call different implementations depending on the actual object.',
    explanation:'Same reference type, different actual behavior chosen at runtime via overriding.',
    explanationAr:'تعدد الأشكال = نوع مرجع واحد وعدة أشكال وقت التشغيل عبر التجاوز والإرسال الديناميكي.' },

  { id:'q082', source:'sheet2', category:'oop', type:'mcq', difficulty:'medium', original:false,
    question:'Which is a valid overloaded set?',
    options:['int f(int a) and int f(int b)','void f(int a) and int f(int a)','int f(int a) and double f(int a)','int f(int a) and int f(int a, int b)'],'answer':3,
    explanation:'Overloading requires the parameter lists to differ. Option D differs by parameter count → valid. Option A is identical signatures (just renamed). Options B and C differ only by return type, which is NOT enough to overload.',
    explanationAr:'يتطلب التحميل الزائد اختلاف قائمة المعاملات. الخيار D يختلف بعدد المعاملات فقط → صحيح.' },

  /* ============== MISSION 6 — SYSTEM RECOVERY ============== */

  { id:'q083', source:'sheet1', category:'exceptions', type:'mcq', difficulty:'easy', original:false,
    question:'Which block ALWAYS executes whether or not an exception is thrown?',
    options:['try','catch','finally','throw'],'answer':2,
    explanation:'finally runs no matter what — exception thrown, no exception, or even a return inside try. Use it to release resources (close files, sockets).',
    explanationAr:'finally يُنفَّذ دائمًا سواء حدث استثناء أم لا، وحتى مع return داخل try. يُستخدم لتحرير الموارد.' },

  { id:'q084', source:'sheet2', category:'exceptions', type:'mcq', difficulty:'easy', original:false,
    question:'Division by zero in Java (int / 0) throws:',
    options:['Compile error','ArithmeticException','NullPointerException','Nothing'],'answer':1,
    explanation:'Integer division by zero throws ArithmeticException at runtime. For double / 0.0 the result is Infinity (no exception) — IEEE 754 behavior.',
    explanationAr:'القسمة الصحيحة على صفر تُطلق ArithmeticException وقت التشغيل. أما double/0.0 فتُعطي Infinity دون استثناء.' },

  { id:'q085', source:'lab4', category:'exceptions', type:'predict', difficulty:'medium', original:false,
    question:'Predict the output:',
    code:'try {\n  int x = 10 / 0;\n} catch (ArithmeticException e) {\n  System.out.println("A");\n} finally {\n  System.out.println("B");\n}\nSystem.out.println("C");',
    options:['A B C','A C','B C','A B'],'answer':0,
    explanation:'Division by zero throws ArithmeticException → catch prints "A". finally always runs → "B". Execution resumes after try/catch/finally → "C". Output: A B C.',
    explanationAr:'القسمة على صفر تُطلق ArithmeticException → catch تطبع A. finally تطبع B دائمًا. ثم C. الناتج A B C.' },

  { id:'q086', source:'sheet1', category:'exceptions', type:'mcq', difficulty:'medium', original:false,
    question:'Which keyword is used to manually raise an exception?',
    options:['throws','throw','raise','try'],'answer':1,
    explanation:'throw new ExceptionType("msg") raises an exception object. throws (with an s) in a method signature declares that the method may throw a checked exception — they are different keywords.',
    explanationAr:'throw تطلق استثناء. throws (بـ s) في توقيع الدالة تعلن أنها قد تُطلق استثناءً مُدققًا. كلمتان مختلفتان.' },

  { id:'q087', source:'midterm2025', category:'exceptions', type:'mcq', difficulty:'medium', original:false,
    question:'RuntimeException and its subclasses are:',
    options:['Checked exceptions','Unchecked exceptions','Errors','Always fatal'],'answer':1,
    explanation:'RuntimeException and subclasses (NullPointerException, ArrayIndexOutOfBoundsException, ArithmeticException) are UNCHECKED — the compiler does not force you to catch or declare them. Other Exception subclasses (IOException, SQLException) are CHECKED.',
    explanationAr:'RuntimeException وفئاتها الفرعية استثناءات غير مُدققة (unchecked) — لا يُجبرك المترجم على التقاطها أو تعريفها.' },

  { id:'q088', source:'sheet2', category:'exceptions', type:'debug', difficulty:'medium', original:false,
    question:'Find the bug:',
    code:'public int read() {\n    BufferedReader br = new BufferedReader(new FileReader("a.txt"));\n    return br.read();\n}',
    options:['Missing throws IOException and never closes the reader','Missing new keyword','Wrong return type','Must use catch'],'answer':0,
    explanation:'FileReader/BufferedReader.read() throw checked IOException, so the method must declare throws IOException (or wrap in try/catch). Also the reader is never closed — use try-with-resources to auto-close.',
    explanationAr:'يجب تعريف throws IOException أو استخدام try/catch، كما يجب إغلاق القارئ (يفضّل try-with-resources).' },

  { id:'q089', source:'lab4', category:'exceptions', type:'explain', difficulty:'medium', original:false,
    question:'Explain the difference between a compile error, a runtime error, and a logical error.',
    reference:'Compile error: caught by javac before the program runs (syntax/type mistakes) — the program will not start. Runtime error: the program compiles but crashes during execution (division by zero, null access). Logical error: the program runs to completion but produces wrong output (off-by-one, wrong formula) — the hardest to find, requires testing.',
    explanation:'Compile = won\'t start. Runtime = crashes mid-run. Logical = runs but wrong answer.',
    explanationAr:'ترجمة: لا يبدأ أصلًا. تشغيل: يتعطل أثناء التنفيذ. منطقي: يعمل لكن الناتج خاطئ.' },

  { id:'q090', source:'final2024', category:'exceptions', type:'predict', difficulty:'hard', original:false,
    question:'Predict the output:',
    code:'try {\n  System.out.print("1 ");\n  int[] a = new int[2];\n  System.out.println(a[5]);\n} catch (ArithmeticException e) {\n  System.out.print("2 ");\n} catch (RuntimeException e) {\n  System.out.print("3 ");\n} finally {\n  System.out.print("4 ");\n}',
    options:['1 2 4','1 3 4','1 4','1 2 3 4'],'answer':1,
    explanation:'a[5] throws ArrayIndexOutOfBoundsException (a subclass of RuntimeException, NOT ArithmeticException). The first matching catch is the RuntimeException one → prints "3". finally prints "4". Output: 1 3 4. Catch order: most specific first.',
    explanationAr:'a[5] تُطلق ArrayIndexOutOfBoundsException (فرع من RuntimeException وليس ArithmeticException)، فيطابق catch الثاني → 3، ثم finally → 4. الناتج 1 3 4.' },

  { id:'q091', source:'sheet1', category:'exceptions', type:'write', difficulty:'medium', original:false,
    question:'Write a custom exception class InvalidAgeException (checked) and a method setAge(int age) that throws it when age < 0.',
    reference:'class InvalidAgeException extends Exception {\n    public InvalidAgeException(String msg) { super(msg); }\n}\n\nvoid setAge(int age) throws InvalidAgeException {\n    if (age < 0) throw new InvalidAgeException("Age cannot be negative: " + age);\n    // store age...\n}',
    explanation:'Extend Exception (checked) and call super(msg) in the constructor. The method declares throws InvalidAgeException so callers must handle or declare it.',
    explanationAr:'ارث من Exception واستدعِ super(msg)، وعرّف throws في توقيع الدالة.' },

  { id:'q092', source:'lab4', category:'exceptions', type:'mcq', difficulty:'easy', original:false,
    question:'Accessing a method on a null reference throws:',
    options:['NullPointerException','NoSuchMethodException','ArithmeticException','ClassNotFoundException'],'answer':0,
    explanation:'NullPointerException is thrown whenever you dereference null — calling a method, accessing a field, or synchronizing on it. Always null-check external input.',
    explanationAr:'NullPointerException تُطلق عند استخدام مرجع null لاستدعاء دالة أو وصول لحقل.' },

  /* ============== MISSION 7 — ADVANCED SYSTEMS ============== */

  { id:'q093', source:'sheet1', category:'advanced', type:'mcq', difficulty:'medium', original:false,
    question:'Which method starts a new thread of execution?',
    options:['run()','start()','begin()','execute()'],'answer':1,
    explanation:'start() schedules a new OS-level thread and invokes run() on it. Calling run() directly just runs the method in the current thread — no new thread is created.',
    explanationAr:'start() تخصص thread جديد وتستدعي run() عليه. استدعاء run() مباشرة ينفذ الدالة في الـ thread الحالي فقط.' },

  { id:'q094', source:'sheet2', category:'advanced', type:'mcq', difficulty:'medium', original:false,
    question:'To make a method thread-safe so only one thread runs it at a time, use:',
    options:['final','static','synchronized','abstract'],'answer':2,
    explanation:'synchronized creates a monitor lock on the method (or block). Only one thread at a time can hold the lock for a given object, preventing concurrent mutation of shared state.',
    explanationAr:'synchronized تنشئ قفلًا يسمح بتنفيذ الدالة (أو الكتلة) لـ thread واحد فقط في كل مرة على نفس الكائن.' },

  { id:'q095', source:'lab4', category:'advanced', type:'predict', difficulty:'medium', original:false,
    question:'A class extends Thread and overrides run() to print numbers 0..2. You call new MyThread().run() instead of start(). What happens?',
    options:['A new thread is created','run() executes in the current thread (no new thread)','Nothing happens','Error'],'answer':1,
    explanation:'Calling run() directly is just a normal method call — it runs in the current thread, sequentially. To actually get concurrency you must call start(), which spawns the thread and then calls run() on it.',
    explanationAr:'استدعاء run() مباشرة استدعاء عادي في الـ thread الحالي. للتزامن استدعِ start() التي تنشئ الـ thread ثم تستدعي run().' },

  { id:'q096', source:'midterm2025', category:'advanced', type:'mcq', difficulty:'medium', original:false,
    question:'A JAR file is essentially a:',
    options:['Compiled native executable','ZIP archive containing .class files and a manifest','Database file','Text source file'],'answer':1,
    explanation:'A JAR (Java Archive) is a ZIP-format archive containing compiled .class files plus a META-INF/MANIFEST.MF. The manifest can declare the Main-Class to make the jar executable: java -jar app.jar.',
    explanationAr:'JAR هو أرشيف بصيغة ZIP يحوي ملفات .class و manifest، ويمكن أن يُحدد Main-Class لجعله تنفيذيًا عبر java -jar.' },

  { id:'q097', source:'sheet1', category:'advanced', type:'mcq', difficulty:'medium', original:false,
    question:'To run an executable JAR file named app.jar, the command is:',
    options:['java app.jar','java -jar app.jar','javac app.jar','run app.jar'],'answer':1,
    explanation:'java -jar app.jar tells the JVM to read the Main-Class from the manifest and execute its main method. Without -jar, java would treat app.jar as a class name.',
    explanationAr:'java -jar app.jar تقرأ Main-Class من الـ manifest وتنفذ main().' },

  { id:'q098', source:'lab4', category:'advanced', type:'mcq', difficulty:'hard', original:false,
    question:'Two threads increment a shared non-synchronized int counter 1000 times each. The final value is most likely:',
    options:['Exactly 2000','Exactly 1000','Less than 2000, nondeterministic','Always 0'],'answer':2,
    explanation:'count++ is not atomic (read, add, write). Without synchronization the threads race and overwrite each other\'s updates — the result is nondeterministic and usually less than 2000. This is a classic race condition.',
    explanationAr:'count++ ليست ذرية (قراءة + جمع + كتابة)، فبدون تزامن تتسابق الـ threads وتُهدر بعض التحديثات — نتيجة غير حتمية وأقل من 2000 عادةً.' },

  { id:'q099', source:'sheet2', category:'advanced', type:'explain', difficulty:'medium', original:false,
    question:'Explain the difference between extending Thread and implementing Runnable to create a thread.',
    reference:'Extending Thread: subclass Thread and override run(); you create an instance and call start(). Limitation — Java allows single inheritance, so your class cannot extend anything else. Implementing Runnable: define the task in a Runnable and pass it to new Thread(runnable); preferred because it separates the task from the thread mechanism and lets your class extend another class if needed.',
    explanation:'Runnable is preferred — separates task from thread, keeps the single-inheritance slot free.',
    explanationAr:'Runnable مفضّل — يفصل المهمة عن الـ thread ويُبقي خانة الوراثة الواحدة متاحة.' },

  { id:'q100', source:'final2025', category:'advanced', type:'mcq', difficulty:'medium', original:false,
    question:'Apache Ant is best described as a:',
    options:['Database engine','Build automation tool driven by XML (build.xml)','Java profiler','GUI framework'],'answer':1,
    explanation:'Ant is a Java build tool. You write build.xml defining targets (compile, jar, run, clean) that wrap javac, jar, etc. Run with ant <target>. Modern alternatives include Maven and Gradle.',
    explanationAr:'Ant أداة بناء لـ Java، تُحرَّك بملف XML اسمه build.xml يحوي أهدافًا مثل compile و jar و run و clean.' }

];

// helper: source display names
const SOURCES = {
  sheet1: 'Sheet 1',
  sheet2: 'Sheet 2',
  lab1: 'Lab 1',
  lab2: 'Lab 2',
  lab3: 'Lab 3',
  lab4: 'Lab 4',
  methodsProblems: 'Methods Problems',
  midterm2024: 'Midterm 2024/2025',
  midterm2025: 'Midterm 2025/2026',
  final2024: 'Final 2024/2025',
  final2025: 'Final 2025/2026'
};

const TYPE_LABELS = {
  mcq: 'MCQ',
  tf: 'True/False',
  predict: 'Predict the Output',
  debug: 'Debugging',
  complete: 'Complete the Code',
  write: 'Write a Program',
  explain: 'Explain Why',
  oopScenario: 'OOP Scenario',
  arrayProblem: 'Array Problem',
  recursionProblem: 'Recursion Problem'
};

const CATEGORY_LABELS = {
  foundation: 'Java Foundation',
  controlflow: 'Control Flow',
  arrays: 'Arrays & Memory',
  methods: 'Methods & Recursion',
  oop: 'OOP City',
  exceptions: 'System Recovery',
  advanced: 'Advanced Systems'
};

const DIFFICULTY_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

window.QUESTIONS = QUESTIONS;
window.SOURCES = SOURCES;
window.TYPE_LABELS = TYPE_LABELS;
window.CATEGORY_LABELS = CATEGORY_LABELS;
window.DIFFICULTY_LABELS = DIFFICULTY_LABELS;
