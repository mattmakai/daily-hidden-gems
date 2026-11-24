/*
 * Content for "The Python Programming Language's Journey... So Far".
 *
 * Everything the site shows lives in this file, so adding a release or fixing
 * a detail never requires touching layout code.
 *
 * Entry fields
 *   id        unique id, also used in the URL hash (#v3.5, #m-origins)
 *   kind      "release" | "milestone"
 *   label     short label shown in the version strip and chart tooltip
 *   title     long title for the detail panel (milestones) — releases use "Python <label>"
 *   date      ISO date (YYYY, YYYY-MM or YYYY-MM-DD; precision is inferred)
 *   line      "early" | "py2" | "py3" | "next"   (controls color)
 *   status    for future entries: "scheduled" | "expected"
 *   headline  one-sentence summary
 *   summary   short paragraph of context
 *   whatsnew  optional URL of the official "What's New" page
 *   features  array of F(...) items
 *
 * Feature fields (built with F): cat, title, peps[], desc, code
 *   code is either {ex, label?, lang?} for a single example or
 *   {before, after, bl?, al?, lang?} for a before/after pair.
 *   In desc, `backticks` become inline code.
 *
 * Last verified against docs.python.org, peps.python.org and
 * devguide.python.org on 2026-11-19.
 */
(function () {
  "use strict";

  function F(cat, title, peps, desc, code) {
    return { cat: cat, title: title, peps: peps || [], desc: desc, code: code || null };
  }

  var lanes = [
    { id: "syntax", name: "Syntax & semantics", short: "Syntax" },
    { id: "types", name: "Typing", short: "Typing" },
    { id: "async", name: "Concurrency & async", short: "Concurrency" },
    { id: "stdlib", name: "Standard library", short: "Stdlib" },
    { id: "runtime", name: "Interpreter & performance", short: "Interpreter" },
    { id: "packaging", name: "Packaging & environments", short: "Packaging" },
    { id: "process", name: "PEPs & process", short: "Process" }
  ];

  var wn = function (v) { return "https://docs.python.org/3/whatsnew/" + v + ".html"; };

  var entries = [
    /* ------------------------------------------------------------------ */
    {
      id: "m-origins", kind: "milestone", label: "1989", line: "early", date: "1989-12",
      title: "A Christmas project at CWI",
      headline: "Guido van Rossum starts writing an interpreter for a new scripting language over the 1989 Christmas holidays.",
      summary: "Guido was working at CWI (Centrum Wiskunde & Informatica) in Amsterdam, where he had previously worked on the ABC teaching language. He wanted something with ABC's readability that could also talk to the operating system and be extended in C — originally to script the Amoeba distributed operating system. He named it after Monty Python's Flying Circus.",
      features: [
        F("syntax", "Readability borrowed from ABC", [],
          "From ABC came the idea that indentation groups statements, a small set of powerful built-in data types, and a strong bias toward code that reads like pseudocode. What ABC lacked — extensibility and access to the host system — became Python's design goals."),
        F("runtime", "Extensible in C from the start", [],
          "The interpreter was designed so new modules could be written in C and loaded alongside Python code. That decision is why Python later became the glue language for scientific computing, systems scripting and much more.")
      ]
    },
    {
      id: "v0.9", kind: "release", label: "0.9", line: "early", date: "1991-02-20",
      headline: "The first public release, posted to the alt.sources newsgroup.",
      summary: "Even this first release had the shape of the language we recognize today. A rapid run of 0.9.x releases followed through 1993 as early users sent patches by email.",
      features: [
        F("syntax", "Classes, functions and exceptions on day one", [],
          "The early 0.9 releases already had classes with inheritance, exception handling with `try`/`except`, functions, and the core data types: `list`, `dict` and `str`."),
        F("stdlib", "A module system inspired by Modula-3", [],
          "Code was organized into modules imported by name, and modules written in C sat alongside modules written in Python. Python's exception model also drew on Modula-3."),
        F("syntax", "Fast iteration through 0.9.x", [],
          "Later 0.9 releases added arbitrary-precision integers (0.9.2), the `global` statement (0.9.4), a `thread` module (0.9.7, 1992), the `str()` and `repr()` built-ins (0.9.8), and `%` string formatting plus `__init__` constructors (0.9.9, July 1993).")
      ]
    },
    {
      id: "v1.0", kind: "release", label: "1.0", line: "early", date: "1994-01-26",
      headline: "Python 1.0 arrives with a dash of functional programming.",
      summary: "The headline additions were contributed by a Lisp programmer who missed them: `lambda`, `map`, `filter` and `reduce`. Guido later admitted he was never fully comfortable with them, which is why Python 3 moved `reduce` out of the built-ins.",
      whatsnew: null,
      features: [
        F("syntax", "lambda, map, filter and reduce", [],
          "Small anonymous functions and the classic functional trio arrived together. In Python 3, `map` and `filter` return lazy iterators and `reduce` lives in `functools`.",
          { ex: "squares = map(lambda x: x * x, range(10))\nevens   = filter(lambda x: x % 2 == 0, range(10))\ntotal   = reduce(lambda a, b: a + b, range(10))", label: "Python 1.0" }),
        F("syntax", "Triple-quoted strings", [],
          "Added in the 1.0.x maintenance releases (1994), `\"\"\"…\"\"\"` strings could span multiple lines — later the natural home for docstrings.")
      ]
    },
    {
      id: "v1.1", kind: "release", label: "1.1", line: "early", date: "1994-10-11",
      headline: "Hooks that let classes customize how they behave.",
      summary: "1.1 started Python down the road of 'special methods': objects could now intercept attribute access and be called like functions.",
      features: [
        F("syntax", "Attribute hooks and callable objects", [],
          "`__getattr__`, `__setattr__` and `__delattr__` let a class intercept attribute access, and `__call__` made instances callable. A new `callable()` built-in checked for it."),
        F("stdlib", "Tkinter and friends ship in the box", [],
          "`tkinter`, `signal`, `termios`, `curses` and `syslog` became part of the base distribution, starting Python's 'batteries included' reputation.")
      ]
    },
    {
      id: "v1.2", kind: "release", label: "1.2", line: "early", date: "1995-04-13",
      headline: "Docstrings, class-based exceptions — and the last release from CWI.",
      summary: "1.2 was the final release made at CWI. That same month Guido moved to CNRI (the Corporation for National Research Initiatives) in Reston, Virginia, where Python development continued until 2000.",
      features: [
        F("syntax", "Docstrings", [],
          "A string literal as the first statement of a module, class or function becomes its `__doc__` attribute — the basis for `help()`, `pydoc` and every documentation tool since.",
          { ex: "def area(r):\n    \"Return the area of a circle of radius r.\"\n    return 3.14159 * r * r\n\nprint area.__doc__", label: "Python 1.2" }),
        F("syntax", "Exceptions can be classes", [],
          "Until now exceptions were plain strings. Allowing classes meant exceptions could form hierarchies and carry data — the model every modern Python program uses."),
        F("stdlib", "pickle, shelve and copy", [],
          "Object serialization (`pickle`), persistent dictionaries (`shelve`) and the `copy` module were added.")
      ]
    },
    {
      id: "v1.3", kind: "release", label: "1.3", line: "early", date: "1995-10-13",
      headline: "\"Two words: Keyword Arguments.\"",
      summary: "That is how the release notes summarized 1.3. Being able to name arguments at the call site made APIs with many optional settings readable.",
      features: [
        F("syntax", "Keyword arguments", [],
          "Callers can pass arguments by name, skipping optional ones they don't need.",
          { ex: "def connect(host, port=80, timeout=30):\n    ...\n\nconnect(\"python.org\", timeout=5)", label: "Python 1.3" }),
        F("stdlib", "Encoding modules", [],
          "`binascii`, `base64`, `uu`, `binhex` and `quopri` arrived, along with the `globals()` and `locals()` built-ins and `sys.platform`.")
      ]
    },
    {
      id: "v1.4", kind: "release", label: "1.4", line: "early", date: "1996-10-25",
      headline: "Complex numbers, the power operator and private names.",
      summary: "1.4 gained features requested by the growing numeric-computing community, the group whose work would eventually lead to NumPy.",
      features: [
        F("syntax", "Complex numbers and **", [],
          "Imaginary literals with a `j` suffix, the `cmath` module, and the `**` operator as a shorthand for `pow()`.",
          { ex: "z = 3 + 4j\nabs(z)      # 5.0\n2 ** 10     # 1024", label: "Python 1.4" }),
        F("syntax", "Name mangling for class-private attributes", [],
          "Attributes named with two leading underscores are rewritten to include the class name, so subclasses can't clobber them by accident.",
          { ex: "class Account:\n    def __init__(self):\n        self.__balance = 0   # stored as _Account__balance", label: "Python 1.4" })
      ]
    },
    {
      id: "v1.5", kind: "release", label: "1.5", line: "early", date: "1998-01-03",
      headline: "Packages, Perl-style regular expressions and assert.",
      summary: "1.5 (and its long-lived 1.5.2 update from 1999) was the version many people first met Python in. It made larger programs practical with hierarchical packages.",
      features: [
        F("syntax", "Packages: import a.b.c", [],
          "Directories containing an `__init__.py` file became packages, so modules could be organized hierarchically instead of in one flat namespace."),
        F("stdlib", "The re module", [],
          "A new regular-expression module with Perl-compatible syntax replaced the older `regex` module. Raw strings (`r\"...\"`) arrived alongside it, so backslashes in patterns didn't need doubling.",
          { ex: "import re\nm = re.match(r\"(\\d+)-(\\d+)\", \"1994-2000\")\nprint m.group(1)", label: "Python 1.5" }),
        F("syntax", "assert and class-based standard exceptions", [],
          "The `assert` statement and `AssertionError` were added, and the built-in exceptions (`KeyError`, `IOError`, …) became classes by default.")
      ]
    },
    {
      id: "m-pep", kind: "milestone", label: "PEP 1", line: "early", date: "2000-06-13",
      title: "The PEP process begins",
      headline: "PEP 1 defines Python Enhancement Proposals: how changes to Python are proposed, debated and decided.",
      summary: "Before 2000, changes were discussed informally on mailing lists. PEP 1 created a written record: every significant change gets a design document with a motivation, specification and rationale. PEP 8, the style guide, followed in 2001, and Tim Peters' 'Zen of Python' (written in 1999) became PEP 20 and ships as `import this`.",
      features: [
        F("process", "PEP 1: PEP purpose and guidelines", [1],
          "Defines the PEP types (Standards Track, Informational, Process) and the statuses a proposal moves through: Draft, then Accepted, Rejected, Deferred or Withdrawn, and finally Final once implemented."),
        F("process", "PEP 8: the style guide", [8],
          "Four-space indentation, `snake_case` functions, `CapWords` classes. Originally the guide for the standard library, it became the de facto style for Python code everywhere."),
        F("process", "PEP 20: The Zen of Python", [20],
          "\"Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex…\" Nineteen aphorisms that are still cited in design debates.",
          { ex: ">>> import this\nThe Zen of Python, by Tim Peters\n\nBeautiful is better than ugly.\nExplicit is better than implicit.\n...", label: "Any Python since 2.2.1", lang: "text" })
      ]
    },
    {
      id: "v1.6", kind: "release", label: "1.6", line: "early", date: "2000-09-05",
      headline: "The last release from CNRI, released weeks before 2.0.",
      summary: "1.6 was released largely for licensing reasons as the core team left CNRI. Its new features — Unicode strings, string methods and a new regex engine — were carried straight into Python 2.0 six weeks later.",
      features: [
        F("syntax", "String methods", [],
          "Functions from the `string` module became methods on string objects.",
          { before: "import string\nstring.upper(s)\nstring.split(line, \",\")", after: "s.upper()\nline.split(\",\")", bl: "Python 1.5", al: "Python 1.6+" }),
        F("syntax", "Unicode strings", [],
          "A separate `unicode` type with `u\"...\"` literals. Python 2 kept two string types side by side until Python 3 made all text Unicode."),
        F("stdlib", "SRE and distutils", [],
          "The `re` module moved to a new engine (SRE), and `distutils` — the first standard way to build and install packages — joined the standard library.")
      ]
    },
    /* ------------------------------------------------------------------ */
    {
      id: "v2.0", kind: "release", label: "2.0", line: "py2", date: "2000-10-16",
      headline: "List comprehensions, augmented assignment and a cycle-detecting garbage collector.",
      summary: "2.0 was the first release after the core team moved to BeOpen and then Zope Corporation, and the first developed with the new PEP process. It borrowed list comprehensions from Haskell.",
      whatsnew: wn("2.0"),
      features: [
        F("syntax", "List comprehensions", [202],
          "Build a list from a loop and a condition in a single expression.",
          { before: "result = []\nfor x in range(10):\n    if x % 2 == 0:\n        result.append(x * x)", after: "result = [x * x for x in range(10) if x % 2 == 0]", bl: "Python 1.x", al: "Python 2.0+" }),
        F("syntax", "Augmented assignment", [203],
          "`+=`, `-=`, `*=` and friends, which can also update mutable objects in place.",
          { before: "count = count + 1", after: "count += 1", bl: "Python 1.x", al: "Python 2.0+" }),
        F("syntax", "Calling with *args and **kwargs", [],
          "Unpacking a tuple and dict into a call no longer needed the `apply()` built-in.",
          { before: "apply(f, args, kwargs)", after: "f(*args, **kwargs)", bl: "Python 1.x", al: "Python 2.0+" }),
        F("runtime", "Garbage collection for reference cycles", [],
          "CPython still frees most objects by reference counting, but a new collector finds and frees groups of objects that refer to each other."),
        F("syntax", "zip(), import … as, print >> f", [201, 221, 214],
          "The `zip()` built-in, renaming on import (`import numpy as np` style), and `print >> f, x` for printing to a file.")
      ]
    },
    {
      id: "v2.1", kind: "release", label: "2.1", line: "py2", date: "2001-04-17",
      headline: "Nested scopes, rich comparisons and the __future__ mechanism.",
      summary: "2.1 introduced `from __future__ import …`, a way to opt into a new behavior one release before it becomes the default. It became Python's standard tool for incompatible changes.",
      whatsnew: wn("2.1"),
      features: [
        F("syntax", "__future__ and nested scopes", [236, 227],
          "Inner functions can see variables of enclosing functions (closures). Optional in 2.1 via `__future__`, the default from 2.2.",
          { ex: "from __future__ import nested_scopes   # needed in 2.1 only\n\ndef make_adder(n):\n    def add(x):\n        return x + n\n    return add", label: "Python 2.1" }),
        F("syntax", "Rich comparisons", [207],
          "Classes can define `__lt__`, `__eq__`, `__gt__` and the rest individually instead of a single `__cmp__`."),
        F("stdlib", "warnings, weakref, unittest, doctest, pydoc", [230, 205],
          "A warnings framework for deprecations, weak references, the `unittest` (PyUnit) and `doctest` testing modules, and `pydoc` for browsing documentation."),
        F("packaging", "Package metadata", [241],
          "PEP 241 defined a standard metadata format (name, version, summary, author) for distributions — the ancestor of today's `pyproject.toml` fields.")
      ]
    },
    {
      id: "v2.2", kind: "release", label: "2.2", line: "py2", date: "2001-12-21",
      headline: "Types and classes unify; iterators and generators arrive.",
      summary: "Probably the deepest change in Python 2. 'New-style' classes (those that inherit from `object`) let you subclass built-in types like `list` and `dict`, and brought properties, static methods and `super()`. Iterators and generators changed how Python code loops.",
      whatsnew: wn("2.2"),
      features: [
        F("syntax", "New-style classes", [252, 253],
          "Inheriting from `object` gave classes descriptors, `property`, `staticmethod`, `classmethod`, `super()`, `__slots__` and a consistent object model. Python 3 made every class new-style.",
          { ex: "class Temperature(object):\n    def __init__(self, celsius):\n        self._c = celsius\n\n    def get_f(self):\n        return self._c * 9.0 / 5 + 32\n    fahrenheit = property(get_f)", label: "Python 2.2 (before decorators)" }),
        F("syntax", "Iterators", [234],
          "The `__iter__`/`next` protocol let any object work in a `for` loop, and dictionaries and files became iterable directly."),
        F("syntax", "Generators", [255],
          "Functions containing `yield` produce values lazily. They needed a `__future__` import in 2.2 and were always on from 2.3.",
          { ex: "from __future__ import generators   # needed in 2.2 only\n\ndef countdown(n):\n    while n > 0:\n        yield n\n        n -= 1", label: "Python 2.2" }),
        F("syntax", "Floor division //", [238],
          "`//` always floors. `from __future__ import division` made `/` true division — the behavior that became the default in Python 3."),
        F("runtime", "int and long begin to unify", [237],
          "Integer operations that overflowed started returning a `long` automatically instead of raising an error.")
      ]
    },
    {
      id: "v2.3", kind: "release", label: "2.3", line: "py2", date: "2003-07-29",
      headline: "A bool type, enumerate() and a big batch of standard library modules.",
      summary: "2.3 had no headline syntax but a lot of everyday improvements, and many of the modules it added are still in daily use.",
      whatsnew: wn("2.3"),
      features: [
        F("syntax", "bool, True and False", [285],
          "A proper `bool` type (a subclass of `int`) replaced the convention of returning `1` and `0`."),
        F("syntax", "enumerate()", [279],
          "Loop over items and their positions without `range(len(…))`.",
          { before: "for i in range(len(names)):\n    print i, names[i]", after: "for i, name in enumerate(names):\n    print i, name", bl: "Before 2.3", al: "Python 2.3+" }),
        F("stdlib", "datetime, itertools, logging, csv and more", [282, 305, 218],
          "`datetime`, `itertools`, `logging`, `csv`, `heapq`, `optparse`, `timeit`, `textwrap` and a `sets` module all arrived in one release."),
        F("syntax", "Source encoding declarations", [263],
          "A `# -*- coding: utf-8 -*-` comment told the interpreter how a source file was encoded."),
        F("runtime", "C3 method resolution order and import hooks", [302],
          "New-style classes switched to the C3 algorithm for multiple inheritance, and PEP 302 import hooks allowed importing from zip files (PEP 273) and other custom sources."),
        F("packaging", "Registering packages on PyPI", [301],
          "PEP 301 added a `register` command to distutils and created the Python Package Index, PyPI.")
      ]
    },
    {
      id: "v2.4", kind: "release", label: "2.4", line: "py2", date: "2004-11-30",
      headline: "Decorators and generator expressions.",
      summary: "The `@decorator` syntax was one of the most debated changes in Python's history. It ended up being one of the most widely used.",
      whatsnew: wn("2.4"),
      features: [
        F("syntax", "Function decorators", [318],
          "`@name` above a function definition replaced the awkward pattern of reassigning the function after its body.",
          { before: "class Circle(object):\n    def unit(cls):\n        return cls(1)\n    unit = classmethod(unit)", after: "class Circle(object):\n    @classmethod\n    def unit(cls):\n        return cls(1)", bl: "Python 2.2–2.3", al: "Python 2.4+" }),
        F("syntax", "Generator expressions", [289],
          "Like list comprehensions, but lazy — values are produced as they are consumed.",
          { ex: "total = sum(x * x for x in numbers)", label: "Python 2.4+" }),
        F("syntax", "Built-in set and frozenset", [218],
          "Sets moved from the `sets` module into the language, along with the new `sorted()` and `reversed()` built-ins and `key=` arguments for sorting."),
        F("stdlib", "decimal, subprocess, collections.deque", [327, 324, 292],
          "Exact decimal arithmetic, a single replacement for `os.system`/`os.popen*`, a fast double-ended queue, and `string.Template`.")
      ]
    },
    {
      id: "v2.5", kind: "release", label: "2.5", line: "py2", date: "2006-09-19",
      headline: "The with statement and conditional expressions.",
      summary: "2.5 added context managers, conditional expressions and coroutine-style generators, along with a set of modules that made Python a stronger application language.",
      whatsnew: wn("2.5"),
      features: [
        F("syntax", "The with statement", [343],
          "Context managers guarantee clean-up such as closing files or releasing locks. It needed a `__future__` import in 2.5 and was always on from 2.6.",
          { before: "f = open(\"data.txt\")\ntry:\n    data = f.read()\nfinally:\n    f.close()", after: "from __future__ import with_statement  # 2.5 only\n\nwith open(\"data.txt\") as f:\n    data = f.read()", bl: "Before 2.5", al: "Python 2.5+" }),
        F("syntax", "Conditional expressions", [308],
          "A real ternary operator replaced the `and`/`or` trick, which silently gave the wrong answer when the 'true' value was falsy.",
          { before: "level = x > 10 and \"high\" or \"low\"", after: "level = \"high\" if x > 10 else \"low\"", bl: "Before 2.5", al: "Python 2.5+" }),
        F("async", "Generators become coroutines", [342],
          "`send()`, `throw()` and `close()` let callers pass values into a running generator. This was the foundation for coroutine libraries and, eventually, asyncio."),
        F("syntax", "Unified try/except/finally and explicit relative imports", [341, 328],
          "`try` can have both `except` and `finally` clauses, and `from . import sibling` makes relative imports explicit."),
        F("stdlib", "sqlite3, ctypes, ElementTree, hashlib", [309],
          "An embedded SQL database, a foreign-function interface for calling C libraries, a fast XML API, modern hashing, plus `functools.partial`, `collections.defaultdict`, `any()` and `all()`.")
      ]
    },
    {
      id: "m-py3000", kind: "milestone", label: "PEP 3000", line: "py2", date: "2006-04",
      title: "Python 3000 is planned",
      headline: "Guido proposes a deliberately backward-incompatible release to fix long-standing design warts.",
      summary: "PEP 3000 and its companions laid out the plan for Python 3: remove duplicate ways of doing things, make all text Unicode, and fix mistakes that couldn't be fixed compatibly. PEP 3099 listed what would not change: indentation, no braces, and so on.",
      features: [
        F("process", "PEP 3000: Python 3000", [3000],
          "Set out the plan: a 2.6 release with forward-compatibility features and warnings, a 3.0 release that breaks compatibility, and a conversion tool (`2to3`) to help migrate code."),
        F("process", "PEP 3099: things that will not change", [3099],
          "A list of rejected ideas — significant whitespace stays, no braces, `lambda` stays — so the Python 3000 discussions didn't go round in circles.")
      ]
    },
    {
      id: "m-virtualenv", kind: "milestone", label: "virtualenv", line: "py2", date: "2007",
      title: "virtualenv and pip (third-party)",
      headline: "Ian Bicking's virtualenv (2007) and pip (2008) change how Python projects manage dependencies.",
      summary: "Neither tool was part of Python itself, but together they established the habit of giving each project its own isolated environment and installing packages into it. Python later adopted both ideas directly: `venv` in 3.3 and `ensurepip` in 3.4.",
      features: [
        F("packaging", "Isolated environments", [],
          "`virtualenv` created a directory with its own `site-packages`, so projects with conflicting dependencies could live on one machine. It became the template for the standard library's `venv` (PEP 405).",
          { ex: "$ pip install virtualenv\n$ virtualenv env\n$ source env/bin/activate\n(env) $ pip install requests", label: "2008-era workflow", lang: "shell" })
      ]
    },
    {
      id: "v2.6", kind: "release", label: "2.6", line: "py2", date: "2008-10-01",
      headline: "The bridge release: Python 3 features you can opt into today.",
      summary: "2.6 was designed alongside 3.0 to make porting possible. It backported new syntax that didn't break old code and added a `-3` flag that warned about code that would break in Python 3.",
      whatsnew: wn("2.6"),
      features: [
        F("syntax", "Python 3 syntax available early", [3105, 3110, 3112, 3127],
          "`from __future__ import print_function`, `except E as e`, `b\"...\"` bytes literals and `0o777` octal literals all worked in 2.6.",
          { ex: "from __future__ import print_function\n\ntry:\n    value = int(text)\nexcept ValueError as e:\n    print(\"bad input:\", e)", label: "Python 2.6" }),
        F("syntax", "str.format()", [3101],
          "A new formatting mini-language with `{}` replacement fields, more flexible than `%`.",
          { ex: "\"{0} is {1} years old\".format(name, age)", label: "Python 2.6+" }),
        F("async", "multiprocessing", [371],
          "A `threading`-like API that uses processes, sidestepping the Global Interpreter Lock (GIL) for CPU-bound work.",
          { ex: "from multiprocessing import Pool\n\ndef square(x):\n    return x * x\n\nif __name__ == \"__main__\":\n    pool = Pool(4)\n    print(pool.map(square, range(10)))", label: "Python 2.6+" }),
        F("stdlib", "json, abc, numbers, fractions, ast", [3119, 3141],
          "A `json` module, abstract base classes, a numeric tower, rational numbers and access to the syntax tree."),
        F("syntax", "Class decorators", [3129],
          "Decorators can be applied to classes as well as functions."),
        F("packaging", "Per-user site-packages", [370],
          "`pip install --user` and its predecessors install into a per-user directory, without needing administrator rights.")
      ]
    },
    {
      id: "v3.0", kind: "release", label: "3.0", line: "py3", date: "2008-12-03",
      headline: "Python 3000: a deliberate break with the past.",
      summary: "3.0 was the first intentionally backward-incompatible Python release. It cleaned up text handling, removed duplicate ways of doing things, and turned many lists into lazy views and iterators. Moving the ecosystem over took about 12 years — see the full Python 2 → 3 breakdown below the timeline.",
      whatsnew: wn("3.0"),
      deepLink: "py3",
      features: [
        F("syntax", "print becomes a function", [3105],
          "The `print` statement was replaced by `print()`, which takes `sep=`, `end=` and `file=` keyword arguments.",
          { before: "print \"Hello,\", name\nprint >> sys.stderr, \"oops\"", after: "print(\"Hello,\", name)\nprint(\"oops\", file=sys.stderr)", bl: "Python 2", al: "Python 3" }),
        F("syntax", "All text is Unicode", [3137, 3120],
          "`str` is now Unicode text and `bytes` is binary data, and mixing them raises an error instead of guessing. Source files default to UTF-8."),
        F("syntax", "True division by default", [238],
          "`/` always returns a float, and `//` floors.",
          { before: ">>> 7 / 2\n3", after: ">>> 7 / 2\n3.5\n>>> 7 // 2\n3", bl: "Python 2", al: "Python 3" }),
        F("syntax", "Views and iterators instead of lists", [3106],
          "`dict.keys()`, `.values()` and `.items()` return live views; `map`, `filter` and `zip` return iterators; `range` behaves like the old `xrange`."),
        F("syntax", "Keyword-only arguments, nonlocal, extended unpacking", [3102, 3104, 3132],
          "Arguments after `*` must be passed by name; `nonlocal` rebinds variables in an enclosing function; `first, *rest = items` unpacks a variable number of items.",
          { ex: "def fetch(url, *, timeout=10):\n    ...\n\nfirst, *rest = [1, 2, 3, 4]\n\ndef counter():\n    count = 0\n    def inc():\n        nonlocal count\n        count += 1\n        return count\n    return inc", label: "Python 3.0+" }),
        F("types", "Function annotations", [3107],
          "Arbitrary expressions can be attached to parameters and return values. The language gave them no meaning, which left room for type hints in 3.5.",
          { ex: "def area(radius: \"meters\") -> \"square meters\":\n    ...", label: "Python 3.0" }),
        F("syntax", "Exceptions cleaned up", [3110, 3109, 3134],
          "`except E as e` is required, exceptions must derive from `BaseException`, and chaining (`raise … from …`) records the cause of an error."),
        F("stdlib", "Standard library reorganized", [3108],
          "Renamed modules to follow PEP 8 (`ConfigParser` → `configparser`, `Queue` → `queue`) and merged duplicates (`urllib` and `urllib2` → `urllib.request`)."),
        F("runtime", "int and long merge", [237],
          "There is only one integer type, `int`, with arbitrary precision. The `L` suffix is gone.")
      ]
    },
    {
      id: "v3.1", kind: "release", label: "3.1", line: "py3", date: "2009-06-27",
      headline: "Making Python 3 fast enough to use.",
      summary: "3.0's new I/O library was written in Python and was slow. 3.1 rewrote it in C and added several conveniences that 2.7 would later backport.",
      whatsnew: wn("3.1"),
      features: [
        F("runtime", "The io library in C", [],
          "File and stream I/O, now built on `io`, was rewritten in C and became several times faster than in 3.0."),
        F("stdlib", "OrderedDict and Counter", [372],
          "A dictionary that remembers insertion order, and a dictionary that counts things."),
        F("syntax", "Simpler format strings", [378],
          "Auto-numbered `{}` fields and a thousands separator in the format mini-language.",
          { ex: "\"{} + {} = {}\".format(1, 2, 3)\n\"{:,}\".format(1234567)    # '1,234,567'", label: "Python 3.1+" }),
        F("syntax", "Multiple context managers in one with", [],
          "`with open(a) as f, open(b) as g:` replaced nested `with` blocks.")
      ]
    },
    {
      id: "v2.7", kind: "release", label: "2.7", line: "py2", date: "2010-07-03",
      headline: "The last Python 2 release — supported for almost ten years.",
      summary: "2.7 backported as much of Python 3.1 as it could without breaking compatibility. Its end-of-life was originally 2015, then pushed to 2020 to give the community more time to port. It received important security backports along the way, including modern TLS support (PEP 466) and a bundled pip (PEP 477).",
      whatsnew: wn("2.7"),
      features: [
        F("syntax", "Python 3 syntax backported", [],
          "Set literals, dictionary and set comprehensions, and multiple context managers in one `with` statement.",
          { ex: "lengths = {name: len(name) for name in names}\nvowels = {\"a\", \"e\", \"i\", \"o\", \"u\"}", label: "Python 2.7 and 3.x" }),
        F("stdlib", "argparse, OrderedDict, Counter", [389, 372],
          "Python 3's new modules were made available in 2.7 so code could use the same APIs in both versions."),
        F("process", "An extended support window", [373, 466, 477],
          "PEP 373 set the schedule. Network-security backports (PEP 466) and a bundled pip (PEP 477) arrived in 2.7.9 in 2014.")
      ]
    },
    {
      id: "v3.2", kind: "release", label: "3.2", line: "py3", date: "2011-02-20",
      headline: "concurrent.futures, a new GIL and a pause on language changes.",
      summary: "During the development of 3.2, PEP 3003 froze the language: no syntax changes for about two years, so alternative implementations and library authors could catch up with Python 3. Work focused on the standard library and the interpreter.",
      whatsnew: wn("3.2"),
      features: [
        F("async", "concurrent.futures", [3148],
          "A high-level way to run functions in thread or process pools and collect the results.",
          { ex: "from concurrent.futures import ThreadPoolExecutor\n\nwith ThreadPoolExecutor(max_workers=8) as pool:\n    pages = list(pool.map(fetch, urls))", label: "Python 3.2+" }),
        F("runtime", "A new GIL", [],
          "Antoine Pitrou's reimplementation of the Global Interpreter Lock switches threads on a time interval instead of a count of bytecodes, which reduced contention on multi-core machines."),
        F("stdlib", "functools.lru_cache and argparse", [389],
          "Memoization in one line, plus `argparse` as the recommended command-line parser.",
          { ex: "from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)", label: "Python 3.2+" }),
        F("runtime", "__pycache__ and a stable ABI", [3147, 3149, 384],
          "Compiled `.pyc` files move into `__pycache__` directories tagged by interpreter version, and a limited 'stable ABI' lets one extension binary work across Python 3 versions."),
        F("process", "PEP 3003: language moratorium", [3003],
          "No new syntax or built-ins for a while, so the ecosystem could focus on porting to Python 3.")
      ]
    },
    {
      id: "m-pep404", kind: "milestone", label: "PEP 404", line: "py2", date: "2011-11",
      title: "There will be no Python 2.8",
      headline: "PEP 404 is an 'un-release schedule' that makes it official: 2.7 is the final Python 2.",
      summary: "PEP 404 (the number was a deliberate joke) closed the door on a Python 2.8. New features would only ever appear in Python 3.",
      features: [
        F("process", "PEP 404: Python 2.8 Un-release Schedule", [404],
          "Explains why there would be no 2.8, and summarizes the main reasons to move to Python 3.")
      ]
    },
    {
      id: "v3.3", kind: "release", label: "3.3", line: "py3", date: "2012-09-29",
      headline: "venv, yield from, and a string representation that saves memory.",
      summary: "3.3 brought virtual environments into the standard library and made porting from Python 2 easier by allowing the `u\"…\"` prefix again.",
      whatsnew: wn("3.3"),
      features: [
        F("packaging", "venv: virtual environments built in", [405],
          "The `virtualenv` idea, made part of Python itself. Every Python 3 install can create isolated environments with no extra tools.",
          { before: "$ pip install virtualenv\n$ virtualenv env", after: "$ python3 -m venv .venv\n$ source .venv/bin/activate", bl: "Third-party", al: "Python 3.3+", lang: "shell" }),
        F("async", "yield from", [380],
          "A generator can delegate to another generator. This was the key building block for the first version of asyncio a year later.",
          { ex: "def chain(*iterables):\n    for it in iterables:\n        yield from it", label: "Python 3.3+" }),
        F("runtime", "Flexible string representation", [393],
          "Strings use 1, 2 or 4 bytes per character depending on content, which cut memory use for mostly-ASCII text."),
        F("syntax", "u\"…\" literals return", [414],
          "Allowed again as a no-op so the same source could run on Python 2 and 3. A pragmatic concession to porting."),
        F("syntax", "A real OSError hierarchy", [3151],
          "Specific exceptions replaced checking `errno` codes by hand.",
          { before: "import errno\ntry:\n    f = open(path)\nexcept IOError as e:\n    if e.errno == errno.ENOENT:\n        handle_missing()\n    else:\n        raise", after: "try:\n    f = open(path)\nexcept FileNotFoundError:\n    handle_missing()", bl: "Python 2 / 3.2", al: "Python 3.3+" }),
        F("packaging", "Implicit namespace packages", [420],
          "A directory without `__init__.py` can be part of a package spread across several locations."),
        F("stdlib", "unittest.mock, ipaddress, lzma, faulthandler", [],
          "Several widely used modules arrived together, and hash randomization was switched on by default to defend against denial-of-service attacks.")
      ]
    },
    {
      id: "m-wheel", kind: "milestone", label: "Wheels", line: "py3", date: "2013",
      title: "Wheels: a binary package format",
      headline: "PEP 427 defines the .whl format, so packages can be installed without running setup.py.",
      summary: "Before wheels, installing many packages meant running arbitrary build code on the user's machine and often compiling C. Wheels are pre-built archives that installers simply unpack, which made installs faster, safer and more reproducible.",
      features: [
        F("packaging", "PEP 427: The Wheel binary package format", [427],
          "Filenames such as `numpy-2.1.0-cp312-cp312-manylinux_2_17_x86_64.whl` encode the Python version, ABI and platform. Later 'manylinux' PEPs (513, 600) made portable Linux binaries possible.")
      ]
    },
    {
      id: "v3.4", kind: "release", label: "3.4", line: "py3", date: "2014-03-16",
      headline: "asyncio, pathlib, enum — and pip ships with Python.",
      summary: "3.4 added several modules that defined modern Python. Before asyncio, asynchronous I/O meant the aging `asyncore` module or third-party frameworks such as Twisted, Tornado and gevent.",
      whatsnew: wn("3.4"),
      features: [
        F("async", "asyncio (provisional)", [3156],
          "A standard event loop for asynchronous I/O. The first version used generator-based coroutines and `yield from`; dedicated syntax came in 3.5.",
          { ex: "import asyncio\n\n@asyncio.coroutine\ndef greet():\n    yield from asyncio.sleep(1)\n    print(\"hello\")\n\nloop = asyncio.get_event_loop()\nloop.run_until_complete(greet())", label: "Python 3.4" }),
        F("stdlib", "pathlib", [428],
          "Object-oriented filesystem paths.",
          { before: "os.path.join(os.path.dirname(__file__), \"data\", \"config.json\")", after: "Path(__file__).parent / \"data\" / \"config.json\"", bl: "os.path", al: "pathlib (3.4+)" }),
        F("stdlib", "enum", [435],
          "Enumerations as a first-class type.",
          { ex: "from enum import Enum\n\nclass Color(Enum):\n    RED = 1\n    GREEN = 2", label: "Python 3.4+" }),
        F("packaging", "ensurepip: pip included by default", [453],
          "Python installers bootstrap pip, so `python -m pip install …` works out of the box."),
        F("stdlib", "statistics, singledispatch, tracemalloc, selectors", [450, 443, 454],
          "Basic statistics, generic functions dispatched on the argument's type, memory-allocation tracing, and a high-level I/O multiplexing API."),
        F("runtime", "Safe object finalization and SipHash", [442, 456],
          "Objects with `__del__` in reference cycles can now be collected, and string hashing moved to SipHash.")
      ]
    },
    {
      id: "m-2020", kind: "milestone", label: "2 → 2020", line: "py2", date: "2014-04",
      title: "Python 2.7's end of life moves to 2020",
      headline: "Five more years of Python 2.7 maintenance, announced at PyCon 2014.",
      summary: "Ports were taking longer than anyone expected, so 2.7's end of life moved from 2015 to 2020. At the same time, the core team made Python 3 easier to port to (PEP 461 brought back `%` formatting for bytes in 3.5).",
      features: [
        F("process", "PEP 373 updated", [373],
          "The 2.7 release schedule PEP was amended to set 2020 as the end-of-life year.")
      ]
    },
    {
      id: "v3.5", kind: "release", label: "3.5", line: "py3", date: "2015-09-13",
      headline: "async/await, type hints and the @ operator.",
      summary: "3.5 is where modern Python took shape: native coroutine syntax, a standard notation for type hints, and a matrix-multiplication operator for the scientific community.",
      whatsnew: wn("3.5"),
      features: [
        F("async", "async and await", [492],
          "Dedicated syntax for coroutines, separating them clearly from generators.",
          { before: "@asyncio.coroutine\ndef greet():\n    yield from asyncio.sleep(1)\n    print(\"hello\")", after: "async def greet():\n    await asyncio.sleep(1)\n    print(\"hello\")", bl: "Python 3.4", al: "Python 3.5+" }),
        F("types", "Type hints and the typing module", [484, 483],
          "A standard meaning for annotations, checked by external tools like mypy. The interpreter itself ignores them at runtime.",
          { ex: "from typing import List\n\ndef greeting(name: str) -> str:\n    return \"Hello \" + name\n\ndef total(prices: List[float]) -> float:\n    return sum(prices)", label: "Python 3.5" }),
        F("syntax", "Matrix multiplication operator @", [465],
          "An operator for NumPy and friends, so formulas read like math.",
          { before: "c = np.dot(np.dot(a, b), v)", after: "c = a @ b @ v", bl: "Before 3.5", al: "Python 3.5+" }),
        F("syntax", "More unpacking", [448],
          "`*` and `**` work in more places, including several times in one call or literal.",
          { ex: "merged = {**defaults, **overrides}\ncombined = [*first, *second]\nprint(*args1, *args2)", label: "Python 3.5+" }),
        F("stdlib", "os.scandir, math.isclose, subprocess.run", [471, 485],
          "`os.scandir` made `os.walk` several times faster; `subprocess.run` became the recommended way to run commands."),
        F("syntax", "% formatting for bytes", [461],
          "Restored to make porting binary-protocol code from Python 2 easier."),
        F("runtime", "Automatic retry on EINTR", [475],
          "System calls interrupted by signals are retried automatically, removing a whole class of subtle bugs.")
      ]
    },
    {
      id: "m-pyproject", kind: "milestone", label: "pyproject", line: "py3", date: "2016",
      title: "pyproject.toml and build backends",
      headline: "PEP 518 (2016) and PEP 517 (2017) separate 'how to build a package' from setuptools.",
      summary: "For years, `setup.py` — executable code run by setuptools — was the only real way to build a package. These PEPs introduced `pyproject.toml` to declare build requirements and a standard interface any build tool could implement, opening the door to tools like Flit, Hatch, PDM, Poetry and uv.",
      features: [
        F("packaging", "PEP 518: build-system requirements", [518],
          "A `pyproject.toml` file declares what's needed to build the project, so installers can set that up first.",
          { ex: "[build-system]\nrequires = [\"setuptools>=61\"]\nbuild-backend = \"setuptools.build_meta\"", label: "pyproject.toml", lang: "toml" }),
        F("packaging", "PEP 517: a build-system-independent interface", [517],
          "Defines the hooks (`build_wheel`, `build_sdist`) any backend implements, so pip doesn't need to know about setuptools specifically.")
      ]
    },
    {
      id: "v3.6", kind: "release", label: "3.6", line: "py3", date: "2016-12-23",
      headline: "f-strings, variable annotations and a more compact dict.",
      summary: "f-strings quickly became one of Python's most popular features. 3.6 also made asyncio stable (no longer provisional) and added async generators.",
      whatsnew: wn("3.6"),
      features: [
        F("syntax", "Formatted string literals (f-strings)", [498],
          "Expressions embedded directly in strings.",
          { before: "\"Hello, %s! You are %d.\" % (name, age)\n\"Hello, {}! You are {}.\".format(name, age)", after: "f\"Hello, {name}! You are {age}.\"", bl: "Before 3.6", al: "Python 3.6+" }),
        F("types", "Variable annotations", [526],
          "Annotate variables and class attributes, not just function parameters.",
          { ex: "from typing import List\n\nprimes: List[int] = []\ncaptain: str  # declared, not yet assigned", label: "Python 3.6+" }),
        F("syntax", "Underscores in numeric literals", [515],
          "Group digits for readability.",
          { ex: "budget = 1_000_000\nmask = 0b_1111_0000", label: "Python 3.6+" }),
        F("async", "Async generators and comprehensions", [525, 530],
          "`yield` inside `async def`, and `async for` inside comprehensions."),
        F("syntax", "__init_subclass__ and __set_name__", [487],
          "Customize subclass creation without writing a metaclass."),
        F("runtime", "Compact, ordered dict", [468, 520],
          "A new dict implementation used 20–25% less memory and happened to preserve insertion order (an implementation detail until 3.7)."),
        F("stdlib", "secrets and os.PathLike", [506, 519],
          "Cryptographically secure tokens, and a protocol so any path object works with `open()` and `os` functions.")
      ]
    },
    {
      id: "v3.7", kind: "release", label: "3.7", line: "py3", date: "2018-06-27",
      headline: "Data classes, breakpoint() and guaranteed dict ordering.",
      summary: "3.7 cut a lot of boilerplate. `async` and `await` became reserved keywords, and dictionaries preserving insertion order became an official part of the language.",
      whatsnew: wn("3.7"),
      features: [
        F("stdlib", "Data classes", [557],
          "Generate `__init__`, `__repr__` and `__eq__` from annotated fields.",
          { before: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    def __repr__(self):\n        return f\"Point(x={self.x!r}, y={self.y!r})\"\n    def __eq__(self, other):\n        return (self.x, self.y) == (other.x, other.y)", after: "from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float", bl: "Before 3.7", al: "Python 3.7+" }),
        F("async", "asyncio.run and context variables", [567],
          "One call starts the event loop and cleans it up. `contextvars` gives each async task its own context-local state.",
          { before: "loop = asyncio.get_event_loop()\nloop.run_until_complete(main())\nloop.close()", after: "asyncio.run(main())", bl: "Python 3.4–3.6", al: "Python 3.7+" }),
        F("syntax", "Dicts keep insertion order — officially", [],
          "What was an implementation detail of CPython 3.6 became a language guarantee."),
        F("syntax", "breakpoint()", [553],
          "A built-in that drops into the debugger, configurable with `PYTHONBREAKPOINT`."),
        F("types", "Postponed evaluation of annotations", [563, 560],
          "`from __future__ import annotations` stores annotations as strings, making forward references easy and imports cheaper. (Python 3.14 later replaced this with lazy evaluation.)"),
        F("runtime", "UTF-8 mode and dev mode", [540, 538],
          "`-X utf8` ignores the locale and uses UTF-8 everywhere; `-X dev` turns on extra runtime checks."),
        F("syntax", "Module __getattr__", [562],
          "Modules can define `__getattr__` for lazy loading and deprecation warnings.")
      ]
    },
    {
      id: "m-governance", kind: "milestone", label: "Council", line: "py3", date: "2018-07-12",
      title: "From BDFL to Steering Council",
      headline: "After the contentious debate over the walrus operator (PEP 572), Guido steps down as 'Benevolent Dictator For Life'.",
      summary: "The core developers wrote and voted on several governance proposals. PEP 8016 won in December 2018: a five-person Steering Council, elected by the core team, now has the final say on PEPs. The first council was elected in early 2019.",
      features: [
        F("process", "PEP 8016 and PEP 13: the Steering Council model", [8016, 13],
          "PEP 13 documents how Python is governed today: the council accepts or rejects PEPs (often delegating to a PEP-Delegate) and is re-elected after every feature release.")
      ]
    },
    {
      id: "v3.8", kind: "release", label: "3.8", line: "py3", date: "2019-10-14",
      headline: "The walrus operator, positional-only parameters and structural typing.",
      summary: "3.8 is remembered for `:=`, which was controversial enough to change how Python is governed. It also made static typing more expressive with Protocols, TypedDict and Literal.",
      whatsnew: wn("3.8"),
      features: [
        F("syntax", "Assignment expressions :=", [572],
          "The \"walrus operator\" assigns and tests a value in one expression.",
          { before: "chunk = f.read(8192)\nwhile chunk:\n    process(chunk)\n    chunk = f.read(8192)", after: "while chunk := f.read(8192):\n    process(chunk)", bl: "Before 3.8", al: "Python 3.8+" }),
        F("syntax", "Positional-only parameters", [570],
          "Parameters before `/` can't be passed by keyword, so library authors can rename them freely.",
          { ex: "def pow(base, exp, mod=None, /):\n    ...", label: "Python 3.8+" }),
        F("syntax", "f-string debugging with =", [],
          "Print an expression and its value in one go.",
          { ex: ">>> print(f\"{user=} {len(items)=}\")\nuser='guido' len(items)=3", label: "Python 3.8+" }),
        F("types", "Protocol, TypedDict, Literal, Final", [544, 589, 586, 591],
          "Structural ('duck') typing, typed dictionary shapes, literal value types and constants."),
        F("stdlib", "importlib.metadata, cached_property, shared_memory", [],
          "Read installed package metadata, cache computed attributes, and share memory between processes."),
        F("runtime", "Audit hooks and vectorcall", [578, 590, 587],
          "Security tools can observe sensitive runtime events; vectorcall made function calls faster."),
        F("async", "An asyncio REPL", [],
          "`python -m asyncio` starts a REPL where you can use `await` at the top level.")
      ]
    },
    {
      id: "v3.9", kind: "release", label: "3.9", line: "py3", date: "2020-10-05",
      headline: "Dict union, list[int] generics, a new parser — and an annual release cycle.",
      summary: "3.9 was the first release on the annual October schedule set by PEP 602. Under the hood, CPython switched to a PEG parser, which made it possible to add pattern matching in 3.10.",
      whatsnew: wn("3.9"),
      features: [
        F("syntax", "Dictionary merge operators", [584],
          "`|` merges dictionaries; `|=` updates in place.",
          { before: "merged = {**defaults, **overrides}\nsettings.update(overrides)", after: "merged = defaults | overrides\nsettings |= overrides", bl: "Before 3.9", al: "Python 3.9+" }),
        F("types", "Built-in generics", [585, 593],
          "Use `list[int]` and `dict[str, int]` directly, without importing `List` and `Dict` from `typing`. Also `Annotated` for attaching metadata.",
          { before: "from typing import Dict, List\n\ndef index(words: List[str]) -> Dict[str, int]: ...", after: "def index(words: list[str]) -> dict[str, int]: ...", bl: "Python 3.5–3.8", al: "Python 3.9+" }),
        F("runtime", "A new PEG parser", [617],
          "Replaced the 25-year-old LL(1) parser, removing grammar restrictions that blocked new syntax."),
        F("stdlib", "zoneinfo, graphlib, str.removeprefix", [615, 616],
          "IANA time zones in the standard library, topological sorting, and prefix/suffix removal that doesn't misuse `strip`."),
        F("syntax", "Relaxed decorator grammar", [614],
          "Any expression can be a decorator, e.g. `@buttons[0].clicked.connect`."),
        F("process", "PEP 602: an annual release cycle", [602],
          "A new feature release every October, with a 17-month development cycle. From 3.13, each release gets two years of bug fixes and three more of security fixes.")
      ]
    },
    {
      id: "m-sunset", kind: "milestone", label: "Sunset", line: "py2", date: "2020-01-01",
      title: "Python 2 is sunset",
      headline: "On 1 January 2020 Python 2 reached end of life. The final release, 2.7.18, came out on 20 April 2020.",
      summary: "Almost twelve years after 3.0, the transition was over. Major libraries, including NumPy, Django and the scientific stack, had already pledged to drop Python 2. A long tail of internal codebases kept running it, now without upstream security fixes.",
      deepLink: "py3",
      features: [
        F("process", "End of the Python 2 line", [373, 404],
          "No more releases or security fixes from the core team. See the Python 2 → 3 section for what changed and why the migration took so long.")
      ]
    },
    {
      id: "m-pep621", kind: "milestone", label: "PEP 621", line: "py3", date: "2020-11",
      title: "Project metadata in pyproject.toml",
      headline: "PEP 621 standardizes the [project] table, so name, version and dependencies are declared, not computed.",
      summary: "Every build backend reads the same `[project]` fields, so moving between tools no longer means rewriting metadata.",
      features: [
        F("packaging", "PEP 621: Storing project metadata in pyproject.toml", [621],
          "Static, tool-agnostic metadata.",
          { ex: "[project]\nname = \"spam\"\nversion = \"1.0\"\nrequires-python = \">=3.10\"\ndependencies = [\"httpx>=0.27\"]", label: "pyproject.toml", lang: "toml" })
      ]
    },
    {
      id: "v3.10", kind: "release", label: "3.10", line: "py3", date: "2021-10-04",
      headline: "Structural pattern matching and much better error messages.",
      summary: "The `match` statement was the biggest syntax addition since `async`/`await`, made possible by the new PEG parser. 3.10 also began the drive for clearer error messages.",
      whatsnew: wn("3.10"),
      features: [
        F("syntax", "Structural pattern matching", [634, 635, 636],
          "`match`/`case` destructures data by shape, not just by value.",
          { before: "parts = command.split()\nif parts == [\"quit\"]:\n    quit()\nelif len(parts) == 2 and parts[0] == \"go\":\n    go(parts[1])\nelse:\n    print(\"Unknown command\")", after: "match command.split():\n    case [\"quit\"]:\n        quit()\n    case [\"go\", direction]:\n        go(direction)\n    case _:\n        print(\"Unknown command\")", bl: "Before 3.10", al: "Python 3.10+" }),
        F("types", "X | Y union types, ParamSpec, TypeGuard", [604, 612, 613, 647],
          "Write unions with `|`, type decorators precisely, and narrow types with custom checks.",
          { before: "from typing import Optional, Union\n\ndef parse(x: Union[int, str]) -> Optional[int]: ...", after: "def parse(x: int | str) -> int | None: ...", bl: "Before 3.10", al: "Python 3.10+" }),
        F("runtime", "Better error messages", [626],
          "The parser points at the real problem, and line numbers are precise.",
          { before: ">>> print(\"hello\"\n...\nSyntaxError: unexpected EOF while parsing", after: ">>> print(\"hello\"\n  File \"<stdin>\", line 1\n    print(\"hello\"\n         ^\nSyntaxError: '(' was never closed", bl: "Python 3.9", al: "Python 3.10", lang: "text" }),
        F("syntax", "Parenthesized context managers, zip(strict=True)", [618],
          "Spread several `with` items over lines, and make `zip` raise if lengths differ."),
        F("packaging", "distutils deprecated", [632],
          "The original 1998-era build tool was put on a path to removal (gone in 3.12) in favor of setuptools and modern backends."),
        F("stdlib", "EncodingWarning, aiter()/anext(), itertools.pairwise", [597],
          "An opt-in warning when `open()` is called without an encoding — groundwork for UTF-8 by default in 3.15.")
      ]
    },
    {
      id: "m-pep668", kind: "milestone", label: "PEP 668", line: "py3", date: "2022",
      title: "Externally managed environments",
      headline: "PEP 668 lets operating systems mark their Python as 'externally managed', so pip won't overwrite system packages.",
      summary: "Running `pip install` on a Linux distribution's system Python used to risk breaking OS tools. Distributions that adopt PEP 668 make pip refuse to install there and point you to a virtual environment instead — reinforcing the 'one environment per project' habit.",
      features: [
        F("packaging", "PEP 668: Marking Python base environments as externally managed", [668],
          "An `EXTERNALLY-MANAGED` marker file tells installers to stay out of the system environment.",
          { ex: "$ pip install requests\nerror: externally-managed-environment\n× This environment is externally managed\n╰─> To install Python packages system-wide, try apt install\n    python3-xyz ... or use a virtual environment.", label: "Debian / Ubuntu", lang: "text" })
      ]
    },
    {
      id: "v3.11", kind: "release", label: "3.11", line: "py3", date: "2022-10-24",
      headline: "Much faster CPython, exception groups and error messages that point at the culprit.",
      summary: "The first big result of the 'Faster CPython' project: an adaptive, specializing interpreter that made 3.11 about 1.25× faster than 3.10 on average across the standard benchmark suite, with 10–60% gains depending on the workload.",
      whatsnew: wn("3.11"),
      features: [
        F("runtime", "Specializing adaptive interpreter", [659],
          "Bytecode instructions rewrite themselves into specialized versions for the types they actually see. Combined with zero-cost exceptions and cheaper function frames, Python code got faster without changes."),
        F("runtime", "Fine-grained error locations", [657],
          "Tracebacks point at the exact expression that failed.",
          { ex: "Traceback (most recent call last):\n  File \"calc.py\", line 3, in <module>\n    result = (a / b) + (c / d)\n                        ~~^~~\nZeroDivisionError: division by zero", label: "Python 3.11+", lang: "text" }),
        F("async", "Exception groups, except* and TaskGroup", [654, 678],
          "Raise and handle several unrelated exceptions at once — exactly what concurrent tasks produce. `asyncio.TaskGroup` uses this for structured concurrency.",
          { ex: "async with asyncio.TaskGroup() as tg:\n    tg.create_task(fetch(\"a\"))\n    tg.create_task(fetch(\"b\"))\n# both done here; failures surface as an ExceptionGroup\n\ntry:\n    ...\nexcept* ValueError as eg:\n    ...\nexcept* TypeError as eg:\n    ...", label: "Python 3.11+" }),
        F("stdlib", "tomllib", [680],
          "Read TOML — the format of `pyproject.toml` — from the standard library."),
        F("types", "Self, variadic generics, Required/NotRequired, LiteralString", [673, 646, 655, 675, 681],
          "A big typing release: `Self` for fluent methods, `TypeVarTuple` for shape-typed arrays, per-key optionality in TypedDict, and `dataclass_transform` for ORMs.")
      ]
    },
    {
      id: "v3.12", kind: "release", label: "3.12", line: "py3", date: "2023-10-02",
      headline: "New generics syntax, formalized f-strings and a per-interpreter GIL.",
      summary: "3.12 gave type parameters their own syntax and finally gave f-strings a proper grammar. Under the hood, subinterpreters each got their own GIL, and distutils was removed.",
      whatsnew: wn("3.12"),
      features: [
        F("types", "Type parameter syntax and the type statement", [695],
          "Generic classes, functions and type aliases without `TypeVar` boilerplate.",
          { before: "from typing import Generic, TypeVar\n\nT = TypeVar(\"T\")\n\nclass Box(Generic[T]):\n    def __init__(self, item: T) -> None:\n        self.item = item\n\ndef first(xs: list[T]) -> T:\n    return xs[0]", after: "class Box[T]:\n    def __init__(self, item: T) -> None:\n        self.item = item\n\ndef first[T](xs: list[T]) -> T:\n    return xs[0]\n\ntype Pair[T] = tuple[T, T]", bl: "Python 3.5–3.11", al: "Python 3.12+" }),
        F("syntax", "f-strings get a real grammar", [701],
          "Expressions inside f-strings can reuse the outer quote character, contain backslashes and comments, and span lines.",
          { before: "sep = \"\\n\"\nreport = f\"Items:{sep}{sep.join(items)}\"", after: "report = f\"Items:\\n{'\\n'.join(items)}\"", bl: "Python 3.6–3.11", al: "Python 3.12+" }),
        F("async", "A per-interpreter GIL", [684],
          "Each subinterpreter can have its own GIL, a first step toward true parallelism within one process (exposed in Python code in 3.14)."),
        F("runtime", "Immortal objects, inlined comprehensions, sys.monitoring", [683, 709, 669],
          "Objects like `None` skip reference counting, comprehensions run up to twice as fast, and debuggers/profilers get a low-overhead monitoring API."),
        F("types", "@override and TypedDict for **kwargs", [698, 692, 688],
          "Mark methods that override a parent, type keyword arguments precisely, and use the buffer protocol in type hints."),
        F("packaging", "distutils removed", [632],
          "After 24 years, `distutils` left the standard library. Packaging lives in setuptools and other tools that implement PEP 517.")
      ]
    },
    {
      id: "m-pep723", kind: "milestone", label: "PEP 723", line: "py3", date: "2024-01",
      title: "Inline script metadata",
      headline: "PEP 723 lets a single-file script declare its own dependencies in a comment block.",
      summary: "Tools such as pipx, uv and hatch can read the block, create a temporary environment and run the script — no `requirements.txt` needed.",
      features: [
        F("packaging", "PEP 723: Inline script metadata", [723],
          "TOML embedded in a specially formatted comment.",
          { ex: "# /// script\n# requires-python = \">=3.12\"\n# dependencies = [\"httpx\", \"rich\"]\n# ///\nimport httpx\nfrom rich import print", label: "script.py" })
      ]
    },
    {
      id: "v3.13", kind: "release", label: "3.13", line: "py3", date: "2024-10-07",
      headline: "An optional build without the GIL, an experimental JIT and a new REPL.",
      summary: "3.13 shipped the first experimental steps toward two long-standing goals: running Python threads in parallel, and compiling hot code to machine code. It also removed 19 'dead batteries' modules from the standard library.",
      whatsnew: wn("3.13"),
      features: [
        F("async", "Free-threaded build (experimental)", [703],
          "A separate build, usually installed as `python3.13t`, runs without the Global Interpreter Lock so threads can use multiple CPU cores in parallel.",
          { ex: "$ python3.13t -c \"import sys; print(sys._is_gil_enabled())\"\nFalse", label: "Python 3.13t", lang: "shell" }),
        F("runtime", "Experimental JIT compiler", [744],
          "A 'copy-and-patch' JIT, off by default and enabled at build time. It laid the groundwork for later speedups more than it delivered them in 3.13."),
        F("runtime", "A new interactive REPL", [],
          "Based on PyPy's: multi-line editing, color, paste mode and `exit` without parentheses."),
        F("stdlib", "Dead batteries removed", [594],
          "19 legacy modules, including `cgi`, `telnetlib`, `crypt`, `imghdr` and `nntplib`, were removed, along with `2to3`/`lib2to3`."),
        F("types", "TypeVar defaults, ReadOnly, TypeIs, @deprecated", [696, 705, 742, 702],
          "Type parameters with defaults, read-only TypedDict items, better type narrowing, and a decorator that warns at runtime and in type checkers.",
          { ex: "from warnings import deprecated\n\n@deprecated(\"Use parse_v2() instead\")\ndef parse(data): ...", label: "Python 3.13+" }),
        F("syntax", "Defined semantics for locals()", [667],
          "`locals()` and `frame.f_locals` now behave consistently, which matters for debuggers."),
        F("runtime", "iOS and Android", [730, 738],
          "Both mobile platforms became officially supported (tier 3).")
      ]
    },
    {
      id: "m-pep751", kind: "milestone", label: "PEP 751", line: "py3", date: "2025-03",
      title: "A standard lock file",
      headline: "PEP 751 defines pylock.toml, a tool-independent format for reproducible installs.",
      summary: "Each tool used to invent its own lock file (`poetry.lock`, `pdm.lock`, `uv.lock`, pinned `requirements.txt`). PEP 751 gives them a common format that any installer can read.",
      features: [
        F("packaging", "PEP 751: A file format to record Python dependencies", [751],
          "`pylock.toml` records exact versions, hashes and sources for every package to install.")
      ]
    },
    {
      id: "v3.14", kind: "release", label: "3.14", line: "py3", date: "2025-10-07",
      headline: "Template strings, lazily evaluated annotations, and free-threading becomes officially supported.",
      summary: "3.14 settled a long-running typing debate by evaluating annotations lazily, added t-strings for safe string processing, and moved the free-threaded build from experimental to supported (though not yet the default).",
      whatsnew: wn("3.14"),
      features: [
        F("syntax", "Template strings (t-strings)", [750],
          "Like f-strings, but instead of producing a `str` they produce a `Template` object that keeps the static text and the interpolated values separate. Libraries can then escape values safely for HTML, SQL or shell commands.",
          { ex: "from string.templatelib import Template\n\nname = \"<script>\"\ntemplate = t\"Hello, {name}!\"\nisinstance(template, Template)   # True\nhtml(template)   # a library can escape {name} safely", label: "Python 3.14+" }),
        F("types", "Deferred evaluation of annotations", [649, 749],
          "Annotations are evaluated only when something asks for them, so forward references just work. The new `annotationlib` module reads them.",
          { before: "from __future__ import annotations\n\nclass Node:\n    def add(self, child: Node) -> Node: ...", after: "class Node:\n    def add(self, child: Node) -> Node: ...", bl: "Python 3.7–3.13", al: "Python 3.14+" }),
        F("async", "Free-threaded Python officially supported", [779],
          "Phase II of the plan from PEP 703: the GIL-free build is supported, but it is still a separate build and not the default."),
        F("async", "Multiple interpreters in the standard library", [734],
          "`concurrent.interpreters` and `InterpreterPoolExecutor` expose isolated subinterpreters — each with its own GIL — to Python code.",
          { ex: "from concurrent import interpreters\n\ninterp = interpreters.create()\ninterp.exec(\"print('hello from a subinterpreter')\")", label: "Python 3.14+" }),
        F("syntax", "except without parentheses", [758, 765],
          "Several exception types can be listed without brackets when there's no `as`. Also, `return`, `break` and `continue` that exit a `finally` block now emit a `SyntaxWarning`.",
          { before: "except (ValueError, TypeError):", after: "except ValueError, TypeError:", bl: "Before 3.14", al: "Python 3.14+" }),
        F("runtime", "Tail-calling interpreter, JIT in official builds, remote debugging", [768],
          "A new interpreter design with a few percent speedup on supported compilers. Official Windows and macOS binaries include the experimental JIT, which is off by default. `sys.remote_exec()` lets debuggers attach safely to a running process."),
        F("stdlib", "compression.zstd, colorful REPL, asyncio introspection", [784],
          "Zstandard compression, syntax highlighting in the REPL, `python -m asyncio ps PID` to inspect running tasks, and UUID versions 6–8."),
        F("process", "Sigstore replaces PGP signatures", [761],
          "Release artifacts are verified with Sigstore instead of PGP.")
      ]
    },
    {
      id: "v3.15", kind: "release", label: "3.15", line: "py3", date: "2026-10-09",
      headline: "Lazy imports, frozendict, UTF-8 by default and a new profiling package.",
      summary: "The current release. 3.15 tackles startup time with explicit lazy imports, adds an immutable dictionary, makes UTF-8 the default text encoding everywhere, and significantly upgrades the still-experimental JIT.",
      whatsnew: wn("3.15"),
      features: [
        F("syntax", "Explicit lazy imports", [810],
          "A new `lazy` soft keyword defers loading a module until it is first used, which speeds up command-line tools with heavy dependencies. It isn't allowed inside functions, classes or `try` blocks.",
          { ex: "lazy import json\nlazy from pathlib import Path\n\ndef save(data):\n    # json and pathlib are actually imported here, on first use\n    Path(\"out.json\").write_text(json.dumps(data))", label: "Python 3.15+" }),
        F("syntax", "frozendict", [814],
          "An immutable built-in mapping. It is hashable when its keys and values are, so it can be a dict key or a set member.",
          { ex: "config = frozendict(host=\"localhost\", port=8080)\ncache = {config: connect(**config)}", label: "Python 3.15+" }),
        F("syntax", "Unpacking in comprehensions", [798],
          "`*` and `**` can be used directly in comprehensions to flatten.",
          { before: "flat = [x for row in rows for x in row]\nmerged = {k: v for d in dicts for k, v in d.items()}", after: "flat = [*row for row in rows]\nmerged = {**d for d in dicts}", bl: "Before 3.15", al: "Python 3.15+" }),
        F("runtime", "UTF-8 mode on by default", [686],
          "`open()` and friends use UTF-8 when no encoding is given, regardless of the system locale — so the same code reads files the same way on Windows, macOS and Linux.",
          { before: "open(\"notes.txt\", encoding=\"utf-8\")  # needed for portability", after: "open(\"notes.txt\")  # UTF-8 everywhere", bl: "Before 3.15", al: "Python 3.15+" }),
        F("stdlib", "A dedicated profiling package", [799],
          "`profiling.tracing` (the old cProfile) and `profiling.sampling`, a new low-overhead sampling profiler that can attach to running processes and produce flame graphs. The pure-Python `profile` module is deprecated."),
        F("stdlib", "sentinel and math.integer", [661, 791],
          "A built-in type for sentinel values (unique markers such as `MISSING`), and a `math.integer` module for integer-only functions."),
        F("types", "Closed TypedDicts, TypeForm, disjoint bases", [728, 747, 800],
          "TypedDicts can declare whether extra keys are allowed and their type; `TypeForm` annotates values that are themselves types."),
        F("runtime", "An upgraded JIT and frame pointers", [831],
          "The experimental JIT got a new tracing frontend and register allocation, and now beats the regular interpreter on average on the benchmark suite. Frame pointers are on by default so system profilers can see Python stacks."),
        F("async", "Stable ABI for free-threaded builds", [803, 793, 820],
          "`abi3t` lets one compiled extension work across free-threaded Python versions — an important step toward free-threading becoming the default. Official macOS installers now include the free-threaded build by default."),
        F("packaging", "Package startup configuration files", [829],
          "New `.start` files run a named entry point at startup, replacing the long-abused `import` lines in `.pth` files (which will be ignored from 3.18).")
      ]
    },
    /* ------------------------------------------------------------------ */
    {
      id: "v3.16", kind: "release", label: "3.16", line: "next", status: "scheduled", date: "2027-10-05",
      headline: "Scheduled for 5 October 2027. Feature freeze (beta 1) is 4 May 2027.",
      summary: "3.16 is in alpha (alpha 2 came out on 10 November 2026). The items below are either formally accepted PEPs or changes already merged into the alphas. Alpha features can still change or be reverted before beta 1.",
      whatsnew: "https://docs.python.org/3.16/whatsnew/3.16.html",
      features: [
        F("async", "yield from in async generators (accepted)", [828],
          "PEP 828 is accepted for 3.16. It allows `yield from` inside `async def` generators, which has been a `SyntaxError` since async generators were introduced in 3.6."),
        F("stdlib", "In the alphas: regex set operations, Unicode properties", [],
          "The 3.16 alphas add set operations and Unicode property classes to the `re` module, Encrypted Client Hello in `ssl`, and much faster UUID generation (v4/v7)."),
        F("runtime", "In the alphas: faster startup, more platforms", [],
          "Interpreter startup is faster, error messages continue to improve, and CPython gains build support for tvOS, watchOS and visionOS."),
        F("async", "Scheduled removal: the asyncio policy system", [],
          "Event loop policies, deprecated since 3.14, are removed. Use the `loop_factory` argument instead.",
          { before: "asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())\nasyncio.run(main())", after: "asyncio.run(main(), loop_factory=uvloop.new_event_loop)", bl: "Deprecated", al: "Python 3.12+ (required in 3.16)" }),
        F("syntax", "Scheduled removal: ~ on booleans", [],
          "`~True` evaluates to `-2`, which surprised people. Deprecated since 3.12, it is removed in 3.16. Use `not x` (or `~int(x)` if you really want the integer result)."),
        F("stdlib", "Other scheduled removals", [],
          "`asyncio.iscoroutinefunction()` (use `inspect.iscoroutinefunction()`), the `'u'` type code in `array` (use `'w'`), and `shutil.ExecError`.")
      ]
    },
    {
      id: "v3.17", kind: "release", label: "3.17", line: "next", status: "expected", date: "2028-10",
      headline: "Expected around October 2028, following the PEP 602 annual cadence.",
      summary: "No release-schedule PEP has been published yet. What is certain is a list of deprecations scheduled for removal in this release.",
      features: [
        F("stdlib", "Scheduled removal: the profile module", [799],
          "The pure-Python profiler is removed in favor of `profiling.tracing` (PEP 799)."),
        F("types", "Scheduled removal: ByteString", [688],
          "`collections.abc.ByteString` and `typing.ByteString` are removed. Use `collections.abc.Buffer` or explicit unions."),
        F("stdlib", "Other scheduled removals", [],
          "Old `tkinter` variable-tracing methods (`trace_variable()` and friends), `webbrowser.MacOSXOSAScript`, and `typing._UnionGenericAlias`.")
      ]
    }
  ];

  /* ------------------------------------------------------------------ */
  /* Python 2 → 3 deep dive                                             */
  /* ------------------------------------------------------------------ */
  var py2to3 = {
    changes: [
      { title: "print is a function", peps: [3105],
        why: "A statement with special syntax (`>>`, trailing commas) became an ordinary function that can be passed around, mocked or replaced.",
        before: "print \"Hello,\", name\nprint \"no newline\",\nprint >> sys.stderr, \"error\"",
        after: "print(\"Hello,\", name)\nprint(\"no newline\", end=\"\")\nprint(\"error\", file=sys.stderr)" },
      { title: "Text vs. bytes", peps: [3137, 3120],
        why: "Python 2's `str` was bytes that pretended to be text, and implicit ASCII conversions failed far from the source of the bug. Python 3 separates text (`str`) from binary data (`bytes`) and makes you decode and encode explicitly.",
        before: ">>> \"caf\\xc3\\xa9\" + u\"!\"\nUnicodeDecodeError: 'ascii' codec\n  can't decode byte 0xc3 ...",
        after: ">>> data = b\"caf\\xc3\\xa9\"\n>>> data.decode(\"utf-8\") + \"!\"\n'café!'\n>>> data + \"!\"\nTypeError: can't concat str to bytes" , lang: "text" },
      { title: "Division returns floats", peps: [238],
        why: "`/` used to truncate when both operands were integers, so the result depended on the types of the data. Now `/` is always true division and `//` is always floor division.",
        before: ">>> 7 / 2\n3\n>>> 7.0 / 2\n3.5",
        after: ">>> 7 / 2\n3.5\n>>> 7 // 2\n3" },
      { title: "Views and iterators instead of lists", peps: [3106],
        why: "Building full lists you only loop over once wasted memory. Dict methods return live views; `map`, `filter`, `zip` and `range` are lazy. Wrap in `list()` when you need a real list.",
        before: "keys = d.keys()          # a list copy\nfor i in xrange(10**6): ...\nsquares = map(sq, nums)  # a list",
        after: "keys = d.keys()          # a live view\nfor i in range(10**6): ...\nsquares = list(map(sq, nums))" },
      { title: "One way to write exceptions", peps: [3110, 3109, 3134],
        why: "The comma form `except E, e` was easy to confuse with catching two exceptions. Python 3 requires `as`, and exceptions can be chained to record the original cause.",
        before: "try:\n    connect()\nexcept socket.error, e:\n    raise ConnectionFailed, str(e)",
        after: "try:\n    connect()\nexcept OSError as e:\n    raise ConnectionFailed(str(e)) from e" },
      { title: "Integers unified, literals cleaned up", peps: [237, 3127],
        why: "`int` and `long` merged into a single arbitrary-precision `int`. Octal literals need an explicit `0o` prefix, so `0777` no longer silently means 511.",
        before: "big = 2 ** 64      # 18446744073709551616L\nmode = 0755",
        after: "big = 2 ** 64      # 18446744073709551616\nmode = 0o755" },
      { title: "Removed duplicates and oddities", peps: [3100],
        why: "Python 3 dropped redundant spellings: `<>` for `!=`, backticks for `repr()`, `dict.has_key()`, `raw_input` vs. `input` (the old `input()` ran `eval`!), old-style classes, and `cmp`-based sorting.",
        before: "if a <> b: print `a`\nif d.has_key(k): pass\nname = raw_input(\"Name: \")\nitems.sort(cmp=compare)",
        after: "if a != b: print(repr(a))\nif k in d: pass\nname = input(\"Name: \")\nitems.sort(key=functools.cmp_to_key(compare))" },
      { title: "Standard library reorganized", peps: [3108],
        why: "Modules were renamed to follow PEP 8 and duplicates were merged.",
        before: "import ConfigParser, Queue, cPickle\nimport urllib2\nfrom StringIO import StringIO",
        after: "import configparser, queue, pickle\nimport urllib.request\nfrom io import StringIO" },
      { title: "New syntax only in Python 3", peps: [3102, 3104, 3132, 3135, 3107],
        why: "With compatibility already broken, 3.0 also added features: keyword-only arguments, `nonlocal`, extended unpacking, zero-argument `super()` and function annotations.",
        before: "class Child(Parent):\n    def __init__(self):\n        super(Child, self).__init__()\n\nfirst, rest = items[0], items[1:]",
        after: "class Child(Parent):\n    def __init__(self):\n        super().__init__()\n\nfirst, *rest = items" },
      { title: "Comparisons must make sense", peps: [],
        why: "Python 2 would order anything against anything (`None < 0 < \"a\"`), hiding bugs. Python 3 raises `TypeError` when comparing unrelated types.",
        before: ">>> sorted([3, \"a\", None])\n[None, 3, 'a']",
        after: ">>> sorted([3, \"a\", None])\nTypeError: '<' not supported between\n  instances of 'str' and 'int'" }
    ],
    timeline: [
      { date: "2006", text: "PEP 3000 sets out the plan for an intentionally incompatible Python 3." },
      { date: "Oct 2008", text: "Python 2.6 ships `__future__` imports and a `-3` warnings flag to prepare code." },
      { date: "Dec 2008", text: "Python 3.0 is released, along with the `2to3` conversion tool." },
      { date: "Jul 2010", text: "Python 2.7, the last 2.x release, backports what it can." },
      { date: "Nov 2011", text: "PEP 404: officially, there will be no Python 2.8." },
      { date: "Sep 2012", text: "Python 3.3 restores `u\"…\"` literals (PEP 414) so one codebase can support both versions." },
      { date: "Apr 2014", text: "Python 2.7's end of life is pushed from 2015 to 2020." },
      { date: "Sep 2015", text: "Python 3.5 restores `%` formatting for bytes (PEP 461) for porting network code." },
      { date: "Jan 2020", text: "Python 2 reaches end of life. The final release, 2.7.18, follows in April." }
    ],
    tools: "Most projects didn't use `2to3` for a one-time conversion. Instead they wrote code that ran on both versions, with help from `__future__` imports and compatibility libraries such as `six` and `python-future`."
  };

  /* ------------------------------------------------------------------ */
  /* Support lifecycle (devguide.python.org/versions, PEP 602, PEP 826) */
  /* ------------------------------------------------------------------ */
  var lifecycle = [
    { v: "3.10", release: "2021-10-04", bugfixEnd: "2023-04", eol: "2026-10" },
    { v: "3.11", release: "2022-10-24", bugfixEnd: "2024-04", eol: "2027-10" },
    { v: "3.12", release: "2023-10-02", bugfixEnd: "2025-04", eol: "2028-10" },
    { v: "3.13", release: "2024-10-07", bugfixEnd: "2026-10", eol: "2029-10" },
    { v: "3.14", release: "2025-10-07", bugfixEnd: "2027-10", eol: "2030-10" },
    { v: "3.15", release: "2026-10-09", bugfixEnd: "2028-10", eol: "2031-10" },
    { v: "3.16", release: "2027-10-05", bugfixEnd: "2029-10", eol: "2032-10", planned: true },
    { v: "3.17", release: "2028-10", bugfixEnd: "2030-10", eol: "2033-10", planned: true, expected: true }
  ];

  /* ------------------------------------------------------------------ */
  /* The road ahead                                                     */
  /* ------------------------------------------------------------------ */
  var ahead = {
    dates: [
      { date: "15 Dec 2026", text: "3.16 alpha 3", status: "scheduled" },
      { date: "4 May 2027", text: "3.16 beta 1 — feature freeze", status: "scheduled" },
      { date: "Oct 2027", text: "Python 3.11 reaches end of life", status: "scheduled" },
      { date: "5 Oct 2027", text: "Python 3.16.0", status: "scheduled" },
      { date: "Oct 2028", text: "Python 3.12 reaches end of life", status: "scheduled" },
      { date: "Oct 2028", text: "Python 3.17.0 (expected; no schedule PEP yet)", status: "expected" }
    ],
    removals: [
      { v: "3.16", items: ["asyncio event loop policies", "`~True` / `~False`", "`asyncio.iscoroutinefunction()`", "`array` type code `'u'`"] },
      { v: "3.17", items: ["`profile` module (use `profiling.tracing`)", "`collections.abc.ByteString`, `typing.ByteString`", "tkinter `trace_variable()` and friends"] },
      { v: "3.18", items: ["`import` lines in `.pth` files are ignored (PEP 829)", "booleans as file descriptors"] },
      { v: "3.19", items: ["`hashlib` constructors' `string=` keyword", "`http.cookies` `js_output()`"] }
    ],
    direction: [
      { title: "Free-threading as the default build", peps: [703, 779, 803],
        text: "PEP 703 described three phases: experimental (3.13), supported (3.14, PEP 779), then default. PEP 779 explicitly leaves phase III to a future PEP, which has not been written yet. The 3.15 groundwork — a stable ABI for free-threaded extensions (`abi3t`) and macOS installers that include the free-threaded build — points in that direction, but there is no date." },
      { title: "A production-ready JIT", peps: [744],
        text: "The JIT is still marked experimental in 3.15, even though it now beats the interpreter on average. PEP 744 (an informational Draft) sets out the conditions for making it non-experimental, including performance and maintainability. Expect continued work in 3.16, but no decision has been announced." }
    ],
    discussion: [
      { title: "Dedented multiline strings (d-strings)", peps: [822], text: "A string prefix that strips common leading indentation, replacing `textwrap.dedent()` calls." },
      { title: "None-aware operators", peps: [823, 824], text: "Proposals for `?.`-style access and a `??` coalescing operator. Earlier versions of this idea (PEP 505) were deferred, so treat these with caution." },
      { title: "Subscriptable functions", peps: [718], text: "Explicitly specialize generic functions, such as `make_list[int]()`." },
      { title: "Leading-dot value patterns in match", peps: [845], text: "Shorter syntax for matching against enum members and constants in `case` clauses." }
    ]
  };

  window.PYHIST = { lanes: lanes, entries: entries, py2to3: py2to3, lifecycle: lifecycle, ahead: ahead, verified: "2026-11-19" };
})();
