# Architecture Language

Read this before naming architecture problems or recommendations. Use these
terms when they make a finding more precise. Preserve repository-native words
such as component, service, API, package, crate, or boundary when those are the
names maintainers already use; explain the relationship to the terms below
only when it matters.

## Terms

**Module**
Anything with an interface and an implementation. Deliberately scale-agnostic - applies equally to a function, class, package, or tier-spanning slice.

**Interface**
Everything a caller must know to use the module correctly. Includes the type signature, but also invariants, ordering constraints, error modes, required configuration, and performance characteristics.

**Implementation**
What's inside a module - its body of code. Distinct from **Adapter**: a thing can be a small adapter with a large implementation, or a large adapter with a small implementation. Reach for "adapter" when the seam is the topic; "implementation" otherwise.

**Depth**
Leverage at the interface - the amount of behaviour a caller or test can exercise per unit of interface they have to learn. A module is **deep** when a large amount of behaviour sits behind a small interface. A module is **shallow** when the interface is nearly as complex as the implementation.

**Seam**
A place where you can alter behaviour without editing in that place. The location at which a module's interface lives. Choosing where to put the seam is its own design decision, distinct from what goes behind it.

**Adapter**
A concrete thing that satisfies an interface at a seam. Describes role, not substance.

**Leverage**
What callers get from depth. More capability per unit of interface they have to learn. One implementation pays back across N call sites and M tests.

**Locality**
What maintainers get from depth. Change, bugs, knowledge, and verification concentrate at one place rather than spreading across callers. Fix once, fixed everywhere.

## Principles

- **Depth is a property of the interface, not the implementation.** A deep module can be internally composed of small, mockable, swappable parts - they just are not part of the interface.
- **The deletion test.** Imagine deleting the module. If complexity vanishes, the module was not hiding anything. If complexity reappears across N callers, the module was earning its keep.
- **The interface is the test surface.** Callers and tests cross the same seam. If testing needs to reach past the interface, the module is probably the wrong shape.
- **One adapter means a hypothetical seam. Two adapters means a real one.** Do not introduce a seam unless something actually varies across it.

## Relationships

- A **Module** has exactly one **Interface**.
- **Depth** is a property of a **Module**, measured against its **Interface**.
- A **Seam** is where a **Module**'s **Interface** lives.
- An **Adapter** sits at a **Seam** and satisfies the **Interface**.
- **Depth** produces **Leverage** for callers and **Locality** for maintainers.
