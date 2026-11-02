# Archived discussion draft — 3 November 2026

This is the original English proposal, retained for provenance. Statements about publication below describe the proposal stage; see PHYSICS_NOTES.md for the implemented learner edition and current status.

I traced the Physics material in [tlyoon/brilliant.org-style-learning-apps](https://github.com/tlyoon/brilliant.org-style-learning-apps), using its current default-branch revision, [`aad23b3`](https://github.com/tlyoon/brilliant.org-style-learning-apps/commit/aad23b3d27cfabde94950221159a413e6c8cf9cf), dated 22 October 2026.

**The draft below covers all 15 Physics lessons currently represented in HaHa. No app files have been changed.**

The repository provides learning objectives, misconception lists, activity packages and [source manifests](https://github.com/tlyoon/brilliant.org-style-learning-apps/tree/main/content/source-manifests). The underlying controlled PDFs are kept outside GitHub. Most manifests identify the edition as unknown and describe the page range only as the complete section PDF. Therefore, this is **original teaching material organised around the repository’s documented scope**, with technical cross-checking—not a claim that I inspected or reproduced the original textbook.

One exception is 1.1: its manifest identifies a Cengage 2019 excerpt covering textbook pages 3–6. Section 8.1 has only a generic source heading; I have given it a clearer working title based on its [recorded learning objectives](https://github.com/tlyoon/brilliant.org-style-learning-apps/blob/main/content/chapter-8/section-8-1/learning-design.md).

I applied the five steps as follows:

| Step | What this draft supplies |
|---|---|
| Curriculum mapping | All 15 existing sections, retaining their conceptual boundaries |
| Beginner-friendly teaching | Eight teaching sections and a worked reasoning example per lesson |
| Meaningful interaction | Explicit plans for figures, graphs and bounded simulations |
| Understanding checks | Two optional checks per lesson and a nine-question review per chapter group |
| Reusable presentation | A consistent lesson structure suitable for later implementation |

All proposed questions below are **qualitative and calculator-free**. Equations explain relationships; learners are not asked to calculate numerical answers. Visuals are plans for later insertion.

---

# Physics teaching draft — Measurement

## 1.1 Standards of Length, Mass, and Time

**Learning goal:** Explain why shared measurement standards matter, distinguish the quantities being measured, and interpret units without confusing them with physical properties.

### 1. Why a measurement needs a shared reference

A measurement compares a physical quantity with an agreed reference. Saying that a table is “five hand spans long” is difficult to reproduce because different people have different hands.

A useful standard allows people in different places to describe the same quantity consistently. The reference should remain stable and be reproducible through an agreed procedure.

### 2. A quantity and its unit are different

Length is a physical quantity. The metre is a unit used to describe length.

Changing the unit changes how we express a measurement; it does not change the object. A road does not become longer when its length is written using a smaller unit.

Keep three ideas separate: the object, the quantity being measured, and the unit used to express it.

### 3. Length and the metre

Length describes spatial separation or extent. We might measure the distance between two marks, the height of a shelf, or the thickness of a sheet.

The modern metre is defined through the fixed speed of light in vacuum and the definition of the second. A particular ruler helps realise that unit; the ruler itself is not the universal definition.

### 4. Time and the second

An instant identifies when something happens. A duration describes the interval between events.

A clock reading can identify an instant. A stopwatch can measure the duration between starting and stopping an event.

The second is defined through a specified transition frequency of caesium-133. It is not defined by the accuracy of an ordinary wristwatch.

### 5. Mass and the kilogram

Mass is a property relevant to inertia: it influences how an object responds to a given net force. The kilogram is the SI unit of mass.

The modern kilogram is defined through the fixed Planck constant, together with the other relevant SI definitions. It is no longer defined by the mass of one particular metal artefact.

The constant-based definitions in these three sections follow the BIPM’s descriptions of the [metre](https://www.bipm.org/en/si-base-units/metre), [second](https://www.bipm.org/en/si-base-units/second) and [kilogram](https://www.bipm.org/en/si-base-units/kilogram).

### 6. Mass is not weight

Weight is a gravitational force. Mass and weight describe different things and use different units.

If an object is moved to a place with weaker gravity, its weight becomes smaller while its mass remains essentially unchanged. A force-measuring scale responds to force, even when its display is calibrated to suggest a mass under particular conditions.

### 7. Base quantities, derived quantities and prefixes

Length, mass and time are base quantities used in this course. Other quantities combine them.

Speed involves distance and time. Density involves mass and volume. These are derived quantities.

Prefixes identify different scales of a unit. A prefix changes the size of the unit used, not the physical quantity being measured. At this stage, concentrate on larger and smaller scales rather than conversion arithmetic.

### 8. Density describes how mass and volume relate

Average density describes how much mass occupies a given volume:

\[
\rho=\frac{m}{V}
\]

For objects with equal volume, the more massive object has greater average density. For objects with equal mass, the one occupying less volume has greater average density.

A larger object is not automatically denser. Samples of the same homogeneous material, under the same conditions, can have different sizes while sharing the same density.

### Worked reasoning example

**Situation:** A sealed sample is taken from Earth to a location with weaker gravity. Assume its material and volume do not change.

1. The sample’s mass remains essentially the same.
2. The gravitational force on it becomes smaller.
3. Its density remains the same because its mass and volume remain the same.

**Conclusion:** A change in weight does not, by itself, imply a change in mass or density.

### Planned visual insertions

**Figure M1 — “Quantity, unit, measuring instrument.”**
A three-column diagram connecting length–metre–ruler, mass–kilogram–mass-measurement apparatus, and duration–second–clock. The caption will explain that an instrument realises a unit rather than defining it.

**Interactive M2 — “Move the sample.”**
A location selector changes the gravitational environment. Separate labelled indicators show unchanged mass and changed gravitational force. Density stays unchanged under the stated assumptions. No numerical response is required.

**Interactive M3 — “Mass and volume comparison.”**
Two original block diagrams allow independent changes to relative mass and volume. Learners predict which block has greater average density before revealing a qualitative comparison.

### Optional checks

**Check 1:** A learner replaces metres with a smaller length unit. Has the object become longer?
**Answer:** No. Only the expression of its length has changed.

**Check 2:** Two samples occupy equal volumes. One has greater mass. Which has greater average density?
**Answer:** The more massive sample, because more mass occupies the same volume.

## Measurement chapter review — nine proposed questions

1. **Why is a shared standard preferable to an individual’s hand span?**
   **Answer:** It supports consistent, reproducible comparisons between people and places.

2. **Is length a unit or a physical quantity?**
   **Answer:** A physical quantity; the metre is one unit for expressing it.

3. **Does an exact unit definition make every measurement exact?**
   **Answer:** No. Real instruments and measurement procedures still have uncertainty.

4. **Which does a stopwatch normally measure: an instant or a duration?**
   **Answer:** A duration between events.

5. **Does weaker gravity necessarily reduce an object’s mass?**
   **Answer:** No. It reduces the gravitational force on the object.

6. **Which quantity is expressed in kilograms: mass or weight?**
   **Answer:** Mass. Weight is a force.

7. **Is speed a base quantity in the length–mass–time framework?**
   **Answer:** No. It combines length and time.

8. **Does changing a unit prefix alter the measured object?**
   **Answer:** No. It changes the unit scale used to describe it.

9. **Is a larger sample necessarily denser?**
   **Answer:** No. Density depends on the relationship between mass and volume, not size alone.

---

# Physics teaching draft — Energy and energy transfer

## 8.1 Energy Transfer in a Nonisolated System

*Working title derived from the upstream section’s learning objectives.*

**Learning goal:** Choose a system boundary and distinguish stored energy, energy transfer and internal transformation.

### 1. Choose the system before describing its energy

A system is the collection of objects we choose to study. Everything outside it forms the surroundings.

The boundary may be imaginary. It is useful because it tells us whether an interaction takes place inside the chosen system or crosses between the system and its surroundings.

### 2. Identify the energy stored inside

For the situations in this chapter, we distinguish kinetic energy, potential energy associated with interactions, and internal energy.

Kinetic energy describes motion. Potential energy describes configurations such as a stretched spring or an object–Earth arrangement. Internal energy includes microscopic motion and other internal stores.

Do not count the same store twice under different names.

### 3. Work is an energy-transfer process

A force can transfer energy when its point of application moves. For a constant force acting through a displacement:

\[
W=\mathbf F\cdot\Delta\mathbf r
\]

Work is positive when the force transfers energy into the chosen system and negative when it transfers energy out through that interaction.

A force’s existence alone does not establish that it does work.

### 4. Recognise other transfer channels

The course’s bookkeeping distinguishes mechanical work, electrical transmission, mechanical waves, electromagnetic radiation, matter transport and thermal transfer.

These are ways energy can cross a boundary—not additional varieties of energy stored in an object.

Descriptions can overlap physically. For example, radiation can be a mechanism of heat transfer. Each transfer must be counted once under a consistent convention.

### 5. Distinguish heat from internal energy

Internal energy belongs to the system’s state. Heat describes energy transfer associated with a temperature difference.

An object does not contain a substance called “heat.” After a thermal transfer, its internal energy may have changed.

Radiation can transfer energy across a vacuum, so material contact is not a universal requirement for energy transfer.

### 6. Write an energy balance

Use the relationship:

\[
\Delta E_{\mathrm{system}}
=E_{\mathrm{in}}-E_{\mathrm{out}}
\]

The system gains energy when more enters than leaves. Its energy decreases when more leaves than enters.

A constant system energy does not prove that no transfers occurred: equal incoming and outgoing transfers can balance.

### 7. Separate transfer from transformation

If electrical energy crosses into a heater, that is a boundary transfer. If energy already inside a system changes from one store to another, that is an internal transformation.

The distinction depends on the boundary. Including a battery inside the system makes its energy decrease part of the internal account.

### 8. Build the simplest complete account

Start by listing the system contents. Then identify relevant stores, incoming transfers and outgoing transfers.

Leave out channels that are negligible for the stated situation. Do not add a heat or radiation arrow merely because a real object could exchange energy that way; the model must state which effects matter.

### Worked reasoning example

**Situation:** An insulated device receives energy through an electrical connection and becomes warmer.

1. Choose the device as the system.
2. Identify electrical transmission as the incoming channel.
3. With negligible outgoing transfer, the device’s internal energy increases.

If energy subsequently leaves because of a temperature difference, add that outgoing transfer to the ledger.

### Planned visual insertions

**Figure E1 — “The system boundary.”**
A device enclosed by a dashed boundary, with separately labelled incoming and outgoing arrows. Stored-energy boxes sit inside; transfer labels sit on arrows crossing the boundary.

**Interactive E2 — “Change the boundary.”**
A boundary selector includes or excludes an energy source. Learners classify a highlighted process as external transfer or internal transformation. The underlying physical process stays unchanged.

### Optional checks

**Check 1:** Equal amounts of energy enter and leave a device. Is it necessarily isolated?
**Answer:** No. Transfers still cross its boundary even though its energy is constant.

**Check 2:** Is internal energy a transfer mechanism?
**Answer:** No. It is stored energy; a transfer changes the system’s energy account.

---

## 8.2 Isolated Systems and Conservation of Energy

**Learning goal:** Explain how energy can change form inside an isolated system while its total remains constant.

### 1. Define energy isolation carefully

An energy-isolated model neglects energy transfers across the chosen boundary.

Isolation concerns the boundary, not whether the objects inside move or interact. A system can contain changing motion, forces and deformation while exchanging negligible energy with its surroundings.

### 2. Apply the conservation statement

For an isolated system:

\[
\Delta E_{\mathrm{system}}=0
\]

This means the total energy remains constant. Individual stores can increase or decrease.

The conservation statement is an account of the whole system, not a requirement that every component keep its original energy.

### 3. Identify mechanical energy

In the models used here:

\[
E_{\mathrm{mechanical}}=K+U_g+U_s
\]

Here \(K\) is kinetic energy, \(U_g\) gravitational potential energy, and \(U_s\) elastic potential energy.

If relevant transfers and internal dissipative changes are negligible, these mechanical stores exchange energy while their sum remains constant.

### 4. Follow gravitational energy changes

When an object descends, the gravitational potential energy of the object–Earth system decreases.

If the model has negligible resistance and no other changing stores, kinetic energy increases. On an upward journey, the exchange reverses.

Including Earth in the system makes gravitational potential energy an internal interaction store.

### 5. Follow elastic energy changes

A spring stores elastic potential energy when stretched or compressed relative to its relaxed state.

When released, that store can decrease while kinetic energy increases. At a turning point, the moving object can be momentarily at rest while the spring remains deformed.

Momentary rest does not mean the system contains no energy.

### 6. Keep internal energy in the account

An isolated system can develop more internal energy through friction or deformation.

In that case, mechanical energy may decrease even though total energy remains constant. “Isolated” does not automatically mean “mechanical energy is constant.”

The distinction between total and mechanical energy is central to [energy-conservation treatments](https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy).

### 7. Change the boundary without changing the event

For a falling object alone, gravity is an external interaction. For the object and Earth together, gravitational potential energy belongs inside the account.

Both descriptions can be useful. The error is mixing them—for example, counting the same gravitational interaction as both external work and an internal potential-energy change.

### 8. Use initial and final states wisely

An energy argument often connects two states without describing every instant between them.

For conservative interactions, the potential-energy difference depends on the endpoints. However, rough paths can introduce different internal-energy changes.

Always inspect the assumptions before concluding that two different routes produce the same final speed.

### Worked reasoning example

**Situation:** A cart descends a smooth track and compresses a spring.

1. Include the cart, Earth and spring in the system.
2. During descent, gravitational potential energy decreases while kinetic energy grows.
3. During compression, kinetic energy changes into elastic potential energy.

At maximum compression, the cart is momentarily at rest. The energy has not disappeared; it is stored in the spring and the remaining gravitational configuration.

### Planned visual insertions

**Simulation E3 — “Track and spring.”**
A cart moves along a smooth track into a spring. Synchronized bars show \(K\), \(U_g\), \(U_s\) and constant total energy. Controls: release position, pause, step and reset.

**Figure E4 — “One event, two boundaries.”**
Side-by-side accounts for an object alone and an object–Earth system. The figure explicitly prevents double counting gravity.

### Optional checks

**Check 1:** At maximum spring compression, the cart has no kinetic energy. Has the system lost all its energy?
**Answer:** No. Energy remains in other stores.

**Check 2:** Can an isolated system experience a rise in internal energy?
**Answer:** Yes, through transformations inside its boundary.

---

## 8.3 Situations Involving Kinetic Friction

**Learning goal:** Explain where mechanical energy goes during sliding and recognise the limits of a particle-only account.

### 1. Identify relative sliding

Kinetic friction concerns surfaces sliding relative to each other.

In the elementary model, the friction force opposes relative sliding at the interface. It does not always oppose an object’s velocity in every possible reference frame.

State which surface and frame the diagram describes.

### 2. Use the friction model with its assumptions

A common approximation is:

\[
f_k=\mu_kN
\]

This model connects friction magnitude with the normal force and a coefficient describing the surfaces.

It is an approximation for a stated contact situation. It does not explain every detail of real friction or determine how energy is distributed between the surfaces.

### 3. Connect friction with internal changes

Real contact regions deform and interact. Ordered motion can be transformed into microscopic motion, deformation and vibration.

The result can include increased internal energy in both contacting objects. Mechanical energy becoming less available for organised motion is not energy being destroyed.

### 4. Choose a system that includes the interface

For a sliding block plus its supporting surface, the friction interaction lies inside the boundary.

If other transfers are negligible, decreasing mechanical energy is accompanied by increasing internal energy. An account of the block alone needs additional care because the contact interaction crosses its boundary.

### 5. Relate internal-energy increase to sliding distance

For the simplified constant-friction model of the combined contacting system:

\[
\Delta E_{\mathrm{int}}=f_kd_{\mathrm{relative}}
\]

The distance is the relative sliding distance. The relation does not, by itself, tell us how much energy warms each object.

It also does not justify assigning every energy change to the block alone.

### 6. Keep translation and total energy distinct

A centre-of-mass force–displacement calculation can describe the change in translational kinetic energy.

It does not automatically provide the full energy account of a deformable contact interface. Actual work uses the motion of the force’s application point.

This distinction follows the point-particle and extended-system treatment discussed by [Chabay, Sherwood and Titus](https://matterandinteractions.org/wp-content/uploads/2019/06/AJPEnergy.pdf).

### 7. Examine an angled pull carefully

An upward component of a pulling force can reduce the normal force while contact is maintained. Under the friction model, this can reduce friction.

However, changing the angle also changes the horizontal pulling component. Therefore, “less friction” alone does not establish which pull produces the greatest kinetic-energy gain.

Both effects belong in the reasoning.

### 8. Follow a spring–block system on a rough surface

A compressed spring can start a block moving. As the block slides, some mechanical energy becomes internal energy.

If the block returns, it does not necessarily recover its earlier speed or deformation. A repeated position does not imply a repeated energy distribution when friction has acted.

### Worked reasoning example

**Situation:** A block is pulled across a rough horizontal surface at constant speed.

1. Constant speed means its translational kinetic energy is unchanged.
2. The applied pull still transfers energy into the block–surface system.
3. With negligible energy escape, internal energy increases.

Zero change in translational kinetic energy is not the same as zero energy transfer.

### Planned visual insertions

**Figure E5 — “Motion view and energy view.”**
A free-body diagram sits beside a block–surface energy account. A clearly labelled microscopic inset illustrates deformation schematically, without pretending to reproduce a literal atomic surface.

**Interactive E6 — “Pulling direction.”**
A bounded angle control updates horizontal pull, normal force and friction indicators. It will show competing effects rather than imply a universal “best angle.” Contact-loss cases are excluded from this introductory model.

### Optional checks

**Check 1:** Must all friction-related internal-energy increase occur in the sliding block?
**Answer:** No. The supporting surface can also gain internal energy.

**Check 2:** Does reducing friction automatically prove a greater final speed when the pulling angle also changes?
**Answer:** No. The forward pulling component also changes.

---

## 8.4 Changes in Mechanical Energy with Nonconservative Forces

**Learning goal:** Track kinetic, potential and internal energy together in systems with sliding friction.

### 1. Start with a complete boundary

Choose a system containing the moving object, the relevant spring or Earth, and the contacting surface when required.

This makes the energy stores and friction-related internal changes explicit. A correct equation depends on what is included inside that boundary.

### 2. Write the isolated-system account

For the simplified models in this lesson:

\[
\Delta K+\Delta U+\Delta E_{\mathrm{int}}=0
\]

The equation says that changes in the listed stores balance. It does not say that kinetic and potential energy must remain constant separately.

### 3. Interpret mechanical-energy decrease

If internal energy increases and no energy crosses the boundary:

\[
\Delta(K+U)=-\Delta E_{\mathrm{int}}
\]

Mechanical energy has decreased, but the system’s total energy has not.

Calling this energy “lost” is convenient only if we immediately explain which store receives it.

### 4. Follow an object down a rough incline

During descent, gravitational potential energy decreases.

Some of that decrease can appear as kinetic energy, while some appears as increased internal energy. Compared with an otherwise equivalent smooth descent, less energy may be available as kinetic energy at the same lower position.

The comparison must keep the initial state and relevant geometry consistent.

### 5. Add a spring to the account

An object arriving at a spring can transfer energy into elastic potential energy while friction continues to increase internal energy.

At a turning point, the object’s kinetic energy is zero. The initial energy is distributed between potential and internal stores.

Do not assume the spring receives all the available energy.

### 6. Read an energy bar chart

A bar chart represents the energy distribution at selected states.

The total height should remain unchanged for an isolated model, even when individual bars change. Increasing the internal-energy bar must be balanced by decreases elsewhere.

A chart with a vanishing total-energy bar is not a valid illustration of ordinary friction.

### 7. Compare rough paths under controlled conditions

A longer sliding distance can produce a larger internal-energy increase when friction magnitude is comparable.

Length alone is not sufficient if other conditions also change. Different inclines may change the normal force, and therefore the friction magnitude.

A fair comparison changes one relevant condition at a time.

### 8. Distinguish conservation from reversibility

Total energy conservation does not guarantee that the original motion can be recovered by reversing the visible path.

Internal-energy changes spread energy into many microscopic degrees of freedom. A cart does not spontaneously regain its original organised motion simply because total energy is conserved.

### Worked reasoning example

**Situation:** Identical carts descend the same smooth ramp, then cross horizontal rough patches of different lengths. Both remain moving.

1. Their energy states at the start of the rough patches are the same.
2. The longer patch produces more internal-energy increase if friction magnitude is the same.
3. Less kinetic energy remains after that patch.

The conclusion follows from the controlled comparison, not from path length alone.

### Planned visual insertions

**Simulation E7 — “Where did the mechanical energy go?”**
A smooth descent followed by a variable-length rough patch. Controls change patch length or friction separately. Bars show kinetic, gravitational, spring and internal energy.

**Graph E8 — “Energy along the route.”**
Horizontal axis: position along the route. Vertical axis: energy. Mechanical energy decreases across the rough patch; internal energy increases; total energy remains constant. Stopping cases are handled explicitly rather than allowing negative kinetic energy.

### Optional checks

**Check 1:** A cart stops because of friction. Does its initial energy cease to exist?
**Answer:** No. It has been redistributed, including into internal energy.

**Check 2:** Can two routes between the same endpoints produce different final speeds?
**Answer:** Yes, when their dissipative energy changes differ.

---

## 8.5 Power

**Learning goal:** Distinguish an amount of transferred energy from the rate at which it is transferred.

### 1. Separate “how much” from “how quickly”

Work describes an energy transfer. Power describes how rapidly the transfer occurs.

Two devices can transfer the same amount of energy while operating for different durations. The faster transfer has greater average power over its operating interval.

### 2. Define average power

For work performed over an interval:

\[
P_{\mathrm{average}}=\frac{W}{\Delta t}
\]

This describes the interval as a whole. It does not require the transfer rate to remain constant throughout that interval.

### 3. Define instantaneous power

Instantaneous power describes the rate at a particular moment:

\[
P=\frac{\mathrm dW}{\mathrm dt}
\]

A device can have a varying instantaneous power while still having a meaningful average power over the full task. These definitions and their distinction follow the standard [power treatment](https://openstax.org/books/university-physics-volume-1/pages/7-4-power).

### 4. Read power from an energy-transfer graph

On a graph of cumulative transferred energy against time, the slope represents power.

A steeper rising section means faster positive energy transfer. A horizontal section means no additional transfer through the channel shown during that interval.

The graph must identify the transfer being tracked; it should not silently substitute the system’s stored energy.

### 5. Connect force, motion and power

For a force acting on a moving particle:

\[
P=\mathbf F\cdot\mathbf v
\]

The component of force along the velocity contributes to this power. A perpendicular force has zero instantaneous power for that particle, even though it can change the motion’s direction.

### 6. Interpret the sign

Positive power means the force is transferring energy into the chosen mechanical account. Negative power means it is taking energy out through that interaction.

A braking force can have negative mechanical power while internal energy increases elsewhere.

The sign is meaningful; power is not always a positive “rating.”

### 7. Distinguish energy and power units

The joule measures energy. The watt measures power.

A kilowatt-hour is an energy unit because it combines a power with a duration. Horsepower is another power unit.

Recognising the type of quantity matters before attempting any conversion.

### 8. Analyse lifting without confusing motor power and net power

During steady upward lifting, the lifting force supplies positive mechanical power while gravity supplies negative power. The object’s kinetic energy can remain constant.

If the object accelerates upward, the lifting force must exceed its weight under the simple model. At the same upward speed, that requires greater lifting power.

Mechanical output power is not identical to every contribution to a motor’s electrical consumption.

### Worked reasoning example

**Situation:** Two lifting devices raise identical loads through the same vertical distance at steady speed. One completes its task sooner.

1. The loads undergo the same gravitational potential-energy increase.
2. The quicker device transfers that energy in less time.
3. It therefore delivers greater average lifting power.

This does not establish its electrical efficiency.

### Planned visual insertions

**Graph E9 — “Same energy, different rates.”**
Two cumulative-work curves reach the same final energy at different times. Learners compare slopes before revealing the power explanation.

**Simulation E10 — “Lifting power.”**
A load moves upward with selectable steady or accelerating motion. Separate indicators show lifting-force power, gravitational power and changing kinetic energy. The simulation does not equate zero net power with an inactive motor.

### Optional checks

**Check 1:** Does greater power always mean a greater total energy transfer?
**Answer:** No. Duration also matters.

**Check 2:** Can the lifting force supply positive power while the load’s kinetic energy stays constant?
**Answer:** Yes. During steady lifting, gravity removes mechanical energy at an equal rate.

## Energy chapter review — nine proposed questions

1. **A system receives and releases energy at equal rates. Is it necessarily isolated?**
   **Answer:** No; its energy can be constant while transfers continue.

2. **An insulated system changes gravitational potential energy into kinetic energy. Has energy crossed its boundary?**
   **Answer:** Not necessarily. This can be an internal transformation.

3. **A cart reaches maximum spring compression. Which statement is correct: energy has vanished, or energy remains in other stores?**
   **Answer:** Energy remains in other stores.

4. **A block slides and stops on a rough surface. Where should the energy account look next?**
   **Answer:** Internal-energy increases and any relevant outgoing transfers.

5. **Does an angled pull affect only friction?**
   **Answer:** No. It can change both normal force and the forward pulling component.

6. **Two isolated-system bar charts show different mechanical energies. Can both be valid?**
   **Answer:** Yes, if their internal-energy changes differ and total energy is accounted for.

7. **Does returning to the same position guarantee the same speed after sliding friction has acted?**
   **Answer:** No. Internal energy may have increased.

8. **Two devices transfer equal energy, but one takes less time. Which has greater average power?**
   **Answer:** The quicker device.

9. **Is a kilowatt-hour a measure of energy or power?**
   **Answer:** Energy.

---

# Physics teaching draft — Momentum and collisions

## 9.1 Linear Momentum

**Learning goal:** Describe momentum as a vector and connect its change with net force.

### 1. Introduce momentum

Linear momentum combines an object’s mass and velocity:

\[
\mathbf p=m\mathbf v
\]

It is useful when describing interactions that change motion. Momentum belongs to a specified object or system in a specified reference frame.

### 2. Keep its direction

Momentum points in the same direction as velocity for an ordinary object with positive mass.

Objects moving in opposite directions can have opposite momenta even when their speeds are equal. A complete momentum description therefore requires direction as well as magnitude.

### 3. Compare masses at the same velocity

At the same velocity, a more massive object has greater momentum magnitude.

An arrow diagram should show that difference through clearly labelled relative arrow lengths—not by making an unexplained larger drawing of the object.

### 4. Compare velocities at the same mass

For equal masses, greater speed means greater momentum magnitude. Reversing velocity reverses momentum.

In one-dimensional motion, choose a positive direction and use signs consistently. A negative momentum component indicates direction; it does not mean “less motion.”

### 5. Distinguish momentum from kinetic energy

Momentum is a vector. Kinetic energy is a scalar.

Oppositely directed momenta can cancel in a system total. Their kinetic energies do not cancel in the same way.

Objects with equal kinetic energy need not have equal momentum magnitudes when their masses differ.

### 6. Use components

A momentum vector can be resolved along perpendicular axes.

The components are parts of the same vector, not additional momenta to count again. This representation becomes especially useful when motion is not confined to a single line.

### 7. Connect net force with momentum change

For a particle:

\[
\mathbf F_{\mathrm{net}}=\frac{\mathrm d\mathbf p}{\mathrm dt}
\]

For constant mass, this gives the familiar relationship between net force and acceleration.

A force can change momentum by changing speed, direction, or both.

### 8. Begin thinking about interacting objects

During an interaction, each object’s momentum may change.

For an appropriate combined system, internal interaction forces can exchange momentum without changing the total. This prepares the distinction between an individual object and an isolated multi-object system.

### Worked reasoning example

**Situation:** Equal-mass carts move with equal speeds in opposite directions.

1. Their momentum arrows have equal magnitudes and opposite directions.
2. The total momentum is zero.
3. Both carts still have kinetic energy because both are moving.

Zero total momentum does not mean that every object is at rest.

### Planned visual insertions

**Interactive P1 — “Momentum arrows.”**
Learners change relative mass, direction and speed. A labelled momentum arrow updates. Numeric calculations are not required.

**Figure P2 — “Vector total versus energy total.”**
Opposite momentum arrows cancel in one panel, while positive kinetic-energy bars add in another.

### Optional checks

**Check 1:** Can a system have zero total momentum and nonzero kinetic energy?
**Answer:** Yes. Oppositely moving objects can have cancelling momenta.

**Check 2:** Must equal kinetic energies imply equal momentum magnitudes?
**Answer:** No. Different masses can give different momentum magnitudes.

---

## 9.2 Isolated Systems and Conservation of Momentum

**Learning goal:** Decide when total momentum remains constant and distinguish internal from external forces.

### 1. Choose the objects in the system

A system might contain one cart, two interacting carts, or the carts and a connecting spring.

An interaction can be external for one choice and internal for another. Draw the boundary before deciding whether momentum is conserved.

### 2. State the conservation condition

Total momentum remains constant when the net external force is zero throughout the interval.

For comparing the beginning and end of an interval, zero net external impulse is sufficient. These statements are related, but they do not mean that momentum must remain constant at every intermediate instant when opposing external impulses cancel only overall.

### 3. Add momenta as vectors

For the chosen system:

\[
\mathbf P=\sum_i\mathbf p_i
\]

If total momentum is conserved:

\[
\mathbf P_{\mathrm{initial}}=\mathbf P_{\mathrm{final}}
\]

The sum must include every object in the chosen system, with its direction represented correctly.

### 4. Identify internal force pairs

When two objects interact through a Newtonian action–reaction pair, the forces act on different objects.

They do not cancel in either object’s individual force equation. They cancel when adding the force equations for the combined system.

### 5. Understand momentum exchange

An internal interaction can decrease one object’s momentum while increasing another’s.

Conservation does not require the objects to maintain their individual momenta. It requires their vector total to remain unchanged under the stated external-force condition.

### 6. Predict recoil

If an initially stationary isolated system separates into two moving parts, the final momenta must be equal and opposite.

Their speeds need not be equal. With unequal masses, the more massive part has the smaller speed for the same momentum magnitude.

### 7. Apply conservation by direction

A system can have negligible external force along one axis even when forces act along another.

For example, horizontal momentum can be conserved while vertical forces are present. Analyse the relevant components instead of making an unsupported claim about all directions.

### 8. Keep momentum and energy conditions separate

Momentum conservation does not automatically imply constant kinetic energy.

Internal stored energy can become kinetic energy, or kinetic energy can become internal energy, while total momentum remains constant.

State the momentum condition and energy condition independently.

### Worked reasoning example

**Situation:** Two unequal carts are initially stationary with a compressed, effectively massless spring between them on a horizontal low-friction track.

1. Choose both carts and the spring as the system.
2. Neglect net external horizontal impulse.
3. After release, the carts have opposite momenta; the more massive cart moves more slowly.

Their kinetic energy comes from the spring’s stored energy.

### Planned visual insertions

**Simulation P3 — “Recoil without momentum creation.”**
A spring separates two carts. Controls change the mass relationship. Individual momentum arrows change, while the total arrow remains fixed.

**Figure P4 — “Internal for two, external for one.”**
A boundary toggle illustrates why the spring’s effect is external to one cart but internal to the combined system.

### Optional checks

**Check 1:** Do internal forces have to vanish for total momentum to be conserved?
**Answer:** No. They can exchange momentum inside the system.

**Check 2:** Do equal and opposite momenta require equal speeds?
**Answer:** Only when the masses are equal.

---

## 9.3 Nonisolated Systems: Impulse and Momentum Change

**Learning goal:** Interpret impulse, force–time graphs and impact-duration changes.

### 1. Describe a force acting over time

A brief strong force and a weaker force acting for longer can produce the same momentum change.

To compare them, we need both force and duration. Force magnitude alone does not describe the full interaction.

### 2. Define impulse

The net external impulse is:

\[
\mathbf J_{\mathrm{ext}}
=\int\mathbf F_{\mathrm{ext,net}}\,\mathrm dt
\]

Impulse is a vector. Its direction is the direction of the resulting change in total momentum.

### 3. Apply the impulse–momentum relationship

\[
\Delta\mathbf P=\mathbf J_{\mathrm{ext}}
\]

The impulse changes the momentum; it is not necessarily equal to the final momentum.

An object can receive an impulse while continuing to move in its original direction.

### 4. Read a force–time graph

The signed area under a force-component–time graph represents the corresponding impulse component.

An area below the time axis contributes with the opposite sign. Equal positive and negative areas can produce zero net impulse over the full interval.

No numerical integration is needed to compare qualitative areas.

### 5. Interpret average force

An equivalent constant average force produces the same impulse over the same duration:

\[
\mathbf J=\mathbf F_{\mathrm{average}}\Delta t
\]

This does not mean the actual force was constant or that its peak equalled the average. These distinctions follow the standard [impulse–momentum treatment](https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions).

### 6. Explain impact mitigation conditionally

For the same initial and final momentum, increasing the stopping duration reduces the required average force magnitude in a straightforward one-direction stopping process.

A longer duration alone does not guarantee a smaller force if the momentum change is also different. Peak-force comparisons require additional information about the force profile.

### 7. Use the impulse approximation

During a sufficiently brief collision, contact forces may produce an impulse much larger than impulses from other forces.

Those smaller contributions can sometimes be neglected over that interval. This is an approximation to justify, not a rule that gravity or other external forces disappear during every collision.

### 8. Distinguish impulse from work

Impulse relates force and time to momentum change. Work relates force and displacement to energy transfer.

The same interaction can be analysed using both ideas, but impulse and work are different quantities with different meanings.

### Worked reasoning example

**Situation:** Identical moving carts are brought to rest by two buffers.

1. Their initial and final momenta are the same in the two trials.
2. Both buffers therefore provide the same net impulse.
3. If one spreads that change over a longer duration, its average stopping force is smaller.

The conclusion depends on keeping the momentum change fixed.

### Planned visual insertions

**Graph P5 — “Same impulse, different force histories.”**
A narrow and a broad force–time curve have equal signed areas. The curves are generated from a controlled model, not adjusted independently.

**Simulation P6 — “Choose a buffer.”**
Learners predict the effect of longer stopping time before revealing synchronized motion and force graphs. Initial and final momentum are held fixed.

### Optional checks

**Check 1:** Does a larger peak force necessarily mean a larger impulse?
**Answer:** No. The full force–time area matters.

**Check 2:** Does a nonzero impulse always reverse motion?
**Answer:** No. It changes momentum but may only reduce or increase its magnitude.

---

## 9.4 Collisions in One Dimension

**Learning goal:** Select the correct conservation relationships for different collision models.

### 1. Define the interval and system

Choose both colliding objects as the system and focus on the collision interval.

Momentum conservation requires negligible net external impulse over that interval. It is not guaranteed simply because an event is called a collision.

### 2. Keep directions and signs consistent

Choose one positive direction for the entire analysis.

A final velocity with the same sign as its initial velocity means the object continues in that direction. A sign change means reversal.

Do not confuse a reduction in speed with a reversal.

### 3. Identify an elastic collision

In an ideal elastic collision, the system’s total kinetic energy is the same before and after.

For a momentum-isolated system, total momentum is also conserved. Individual objects can exchange both momentum and kinetic energy.

### 4. Identify an inelastic collision

In the passive inelastic models used here, some translational kinetic energy changes into internal energy.

The objects may separate after impact. They do not have to stick together, and one object does not have to reverse direction.

Total energy remains conserved when all relevant stores and transfers are included.

### 5. Identify a perfectly inelastic collision

The objects remain joined after impact and share a common final velocity.

For given total mass and momentum, this common-motion state has the minimum translational kinetic energy among the corresponding collision outcomes. It does not necessarily mean the final objects are at rest.

### 6. Interpret relative motion in an elastic collision

For an isolated one-dimensional elastic collision:

\[
v_{1i}-v_{2i}=-(v_{1f}-v_{2f})
\]

The relative speed of approach equals the relative speed of separation.

This is an elastic-collision result. It should not be applied indiscriminately to inelastic collisions.

### 7. Use special cases carefully

For equal masses in an ideal head-on elastic collision, their velocities exchange.

For a light incoming object and a much heavier initially stationary target, the light object can rebound while the target changes speed only slightly.

These conclusions depend on the stated masses, initial motion and collision model.

### 8. Separate stages of a compound event

A capture-and-swing event requires two analyses.

During a brief inelastic capture, use the appropriate momentum account. During the later swing, use an energy account with gravity included appropriately.

Conservation relationships valid during one stage must not automatically be extended to the other.

The distinctions between collision categories and energy stores are consistent with [OpenStax’s collision discussion](https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions).

### Worked reasoning example

**Situation:** A moving soft projectile becomes embedded in a suspended catcher, which then swings upward.

1. During capture, approximate horizontal momentum conservation if external horizontal impulse is negligible.
2. Mechanical energy is not conserved through the embedding process.
3. During the subsequent idealised swing, kinetic energy changes into gravitational potential energy.

One equation should not be stretched across both stages without checking its conditions.

### Planned visual insertions

**Simulation P7 — “Elastic, inelastic or sticking?”**
Two carts interact along a line. Before/after momentum arrows and kinetic/internal-energy bars remain synchronized. A sticking outcome enforces a common final velocity.

**Figure P8 — “Two stages, two models.”**
A timeline separates the capture interval from the swing interval and labels the valid reasoning for each.

### Optional checks

**Check 1:** Does an inelastic collision require a direction reversal?
**Answer:** No. Its defining feature here is a decrease in total kinetic energy.

**Check 2:** If two objects stick together, must they stop?
**Answer:** No. Their common motion depends on the initial total momentum.

---

## 9.5 Collisions in Two Dimensions

**Learning goal:** Use vector momentum conservation without reducing a planar collision to a scalar speed comparison.

### 1. Choose useful axes

Select perpendicular axes that simplify the initial motion.

The axes are a description tool. Rotating them does not change the physical event, but every component must be interpreted consistently in the chosen coordinates.

### 2. Resolve momentum into components

A momentum vector can have horizontal and vertical components.

The components combine to form the original vector. Adding speed magnitudes is not a substitute for adding momentum vectors.

### 3. Apply conservation independently

When the corresponding external impulses are negligible:

\[
P_{x,i}=P_{x,f},
\qquad
P_{y,i}=P_{y,f}
\]

A proposed final state must satisfy both component accounts. Matching one direction does not prove that the full vector equation is satisfied. [Component-form reference](https://openstax.org/books/university-physics-volume-1/pages/9-5-collisions-in-multiple-dimensions)

### 4. Interpret a glancing collision

The objects can leave in different directions while their total momentum retains its required value.

Individual momentum directions can change substantially. Conservation concerns the vector sum, not the preservation of each trajectory.

### 5. Add the energy condition separately

An elastic planar collision also preserves total kinetic energy.

An inelastic collision can satisfy momentum conservation while changing kinetic energy into internal energy. A diagram satisfying momentum alone is not sufficient to establish that the collision is elastic.

### 6. Describe sticking in a plane

If objects join together, their shared final velocity points in the direction of the total initial momentum, assuming that total is nonzero.

The direction does not have to match either original velocity. It follows the vector total.

### 7. Recognise the perpendicular special case

For an ideal elastic glancing collision between identical masses, with one initially stationary and both moving afterward, the outgoing velocities are perpendicular.

The result relies on all those conditions. It is not a general rule for unequal masses, inelastic collisions or every possible initial motion. [Special-case reference](https://www.met.reading.ac.uk/pplato2/h-flap/phys2_5.html)

### 8. Use a momentum triangle to check a picture

Place momentum arrows head-to-tail to compare the initial and final vector totals.

A visually plausible animation can still be physically wrong. The component totals and the applicable energy condition must agree with the arrows.

### Worked reasoning example

**Situation:** Two objects approach from perpendicular directions and stick together.

1. The initial total momentum contains components from both incoming motions.
2. The combined object must carry that same total momentum if external impulse is negligible.
3. Its direction follows the resultant, not an arbitrary average of the incoming directions.

No numerical angle is needed to identify the appropriate quadrant.

### Planned visual insertions

**Interactive P9 — “Build the momentum triangle.”**
Learners arrange labelled arrows head-to-tail. Separate x- and y-ledgers show whether their proposed result matches both component totals.

**Simulation P10 — “Planar collision comparison.”**
A top-down, non-spinning particle model compares an elastic glancing event with sticking. The identical-mass perpendicular case is explicitly labelled as a special mode.

### Optional checks

**Check 1:** Is matching the initial and final x-momentum enough to verify a planar collision?
**Answer:** No. The y-component must also satisfy its conservation condition.

**Check 2:** Must all elastic collisions produce perpendicular outgoing paths?
**Answer:** No. That conclusion requires the specific identical-mass, stationary-target conditions.

---

## 9.6 The Center of Mass

**Learning goal:** Locate and interpret a system’s mass-weighted average position.

### 1. Introduce the center of mass

The center of mass is a position determined by the system’s mass distribution:

\[
\mathbf R_{\mathrm{CM}}
=\frac{\sum_i m_i\mathbf r_i}{\sum_i m_i}
\]

It provides a useful way to describe the location of an extended or multi-object system.

### 2. Understand mass weighting

A more massive part contributes more strongly to the average position.

For two separated objects, the center of mass lies closer to the more massive object. It lies midway only when the relevant masses are equal.

### 3. Use symmetry when justified

A uniform, symmetrically distributed object often has its center of mass at its geometric centre.

The symmetry must concern the mass distribution, not just the outline. Hidden dense material can shift the center of mass even when the shape looks symmetric.

### 4. Allow the center of mass to occupy empty space

The center of mass does not have to lie inside material.

For a uniform ring, it lies at the ring’s geometric centre, even though that location is empty. It is a calculated property of the distribution, not necessarily the position of a particular particle. [Center-of-mass reference](https://openstax.org/books/university-physics-volume-1/pages/9-6-center-of-mass)

### 5. Extend the idea to continuous objects

For a continuous distribution, imagine dividing the object into very small mass elements and forming the same weighted average.

The compact symbolic form is:

\[
\mathbf R_{\mathrm{CM}}=\frac{1}{M}\int\mathbf r\,\mathrm dm
\]

This draft uses the expression to explain the averaging idea, not to require integration exercises.

### 6. Distinguish translation from added rotation

A force whose line of action passes through the center of mass produces no torque about that point from that force.

An off-centre force can also change rotational motion. This does not mean that a force through the center of mass stops pre-existing rotation or cancels every other torque.

### 7. Relate center of gravity and center of mass

The center of gravity describes the effective location of the resultant gravitational force.

In an approximately uniform gravitational field, it coincides with the center of mass. The two ideas should not be treated as universally interchangeable without the field assumption.

### 8. Explain the suspension method

When a rigid object hangs freely and settles, its center of gravity lies on the vertical line below the suspension point.

Suspend it from another point and draw another vertical line. Their intersection locates the center of gravity—and, under the uniform-field approximation, the center of mass. [University demonstration reference](https://lecdem.physics.umd.edu/b/b1/769-b1-01.html)

### Worked reasoning example

**Situation:** A uniform-looking board contains a dense insert near one end.

1. Its outline alone does not establish a symmetric mass distribution.
2. The insert shifts the mass-weighted average toward its end.
3. The center of mass therefore need not coincide with the geometric centre.

### Planned visual insertions

**Interactive P11 — “Move mass, move the center.”**
Two or more mass markers can be repositioned. Their relative masses can change. A separate center-of-mass marker updates.

**Figure P12 — “Find it by suspension.”**
Two hanging orientations of an original irregular shape show plumb lines intersecting. The uniform-field assumption appears in the caption.

### Optional checks

**Check 1:** Must the center of mass lie inside solid material?
**Answer:** No. A ring provides a counterexample.

**Check 2:** Does cutting an object through its center of mass necessarily divide it into equal masses?
**Answer:** No. Equal masses are not guaranteed by that location alone.

---

## 9.7 Systems of Many Particles

**Learning goal:** Connect total momentum and external force with center-of-mass motion.

### 1. Keep the complete system in view

A many-particle system can contain parts moving in very different ways.

Its collective motion can still be described through its total mass and center of mass. For this lesson, the chosen collection has constant total mass.

### 2. Relate total momentum to center-of-mass velocity

\[
\mathbf P=M\mathbf V_{\mathrm{CM}}
\]

This relation does not say every particle moves at the center-of-mass velocity. It says the mass-weighted motion of the complete collection determines its total momentum.

### 3. Add particle force equations

Each particle can experience external forces and forces from other particles.

When the equations are added, internal Newtonian action–reaction pairs cancel in the system total. Internal forces can still be important for individual particle motion.

### 4. Apply the system form of Newton’s second law

For constant total mass:

\[
\sum\mathbf F_{\mathrm{ext}}
=M\mathbf A_{\mathrm{CM}}
\]

Net external force determines center-of-mass acceleration. The system’s internal complexity does not require us to invent an additional external force.

### 5. Describe isolated center-of-mass motion

With zero net external force, the center of mass maintains constant velocity.

Particles inside the system may nevertheless accelerate, collide, oscillate or separate. Constant center-of-mass velocity does not mean that all internal motion is uniform.

### 6. Analyse internal separation

When an initially stationary assembly separates in otherwise force-free space, its parts can move while the center of mass remains stationary.

Stored energy provides the kinetic-energy increase. Internal forces redistribute momentum without creating a net total.

### 7. Follow fragmentation under gravity

For a projectile that fragments in an approximately uniform gravitational field, neglect air resistance and include every fragment.

The center of mass follows the trajectory determined by the unchanged external gravitational force. It continues along the corresponding projectile path even while the pieces separate.

This is not constant-velocity motion: gravity is still external to the fragment system.

### 8. Keep momentum and kinetic-energy accounts distinct

An internal release can increase the system’s kinetic energy without changing its total momentum.

Conversely, internal dissipation can reduce kinetic energy while the center-of-mass motion remains unchanged. A complete energy account is still required.

### Worked reasoning example

**Situation:** A moving container separates into several pieces during flight, with negligible air resistance.

1. Include every piece in the system.
2. The internal separation does not add a net external impulse.
3. The center of mass continues along the gravity-controlled path, while individual paths differ.

Following only one visible piece would not represent the full system.

### Planned visual insertions

**Simulation P13 — “The marker that keeps its path.”**
A projectile separates into a few labelled fragments. A distinct center-of-mass marker remains on a reference trajectory. The model retains every fragment’s mass even when a fragment leaves the visible area.

**Graph P14 — “Total momentum by component.”**
The horizontal component remains constant when external horizontal force is negligible. The vertical component changes under gravity. The graph prevents a false claim that all momentum components are constant.

### Optional checks

**Check 1:** Can particles accelerate while their system’s center of mass has constant velocity?
**Answer:** Yes. Internal forces can change individual motions.

**Check 2:** Is the center of mass of a fragmenting projectile force-free near Earth?
**Answer:** No. Gravity still acts externally on the fragment system.

---

## 9.8 Deformable Systems

**Learning goal:** Explain why center-of-mass motion alone does not provide the complete energy account of a system that changes shape.

### 1. Recognise a deformable system

A deformable system changes its internal arrangement or shape.

A person extending their limbs and a spring being stretched cannot always be represented adequately by a single particle when studying energy. Their center-of-mass motion is only part of the description.

### 2. Identify the relevant displacement

The center of mass can move differently from the point where an external force acts.

Actual mechanical work uses the displacement of the force’s application point. Substituting center-of-mass displacement without checking the model can therefore give an incorrect boundary-transfer account.

### 3. Keep the center-of-mass result

For a constant-mass system:

\[
\int\mathbf F_{\mathrm{ext,net}}\cdot
\mathrm d\mathbf R_{\mathrm{CM}}
=\Delta K_{\mathrm{CM}}
\]

This describes translational kinetic-energy change. It should not automatically be labelled the complete external work on a deformable system.

The distinction is explained in [Sherwood’s discussion of real work and center-of-mass work](https://brucesherwood.net/?p=134).

### 4. Write the extended-system energy account

An extended system can change translational kinetic energy, stored elastic energy and internal energy.

A complete energy analysis must include the relevant changes and boundary transfers. The point-particle account does not become a substitute for those additional stores simply because it predicts the center-of-mass motion correctly.

### 5. Consider pushing from a fixed support

In an idealised push from a rigid support, the contact point can remain stationary while the person’s center of mass moves.

The support can provide an impulse without supplying mechanical work through that stationary point. Energy for the person’s increasing motion can come from internal stores.

### 6. Consider stretching without translation

Two opposite pulls can stretch an elastic object while its center of mass remains stationary.

The pulls can do positive work because their application points move in the directions of their forces. Stored elastic energy can increase even though translational kinetic energy does not.

The two-system distinction is also developed in the [2019 energy-teaching paper](https://matterandinteractions.org/wp-content/uploads/2019/06/AJPEnergy.pdf).

### 7. Classify energy and momentum isolation separately

A negligible external energy transfer does not establish negligible external impulse.

A stationary support can change a system’s momentum through force while doing no mechanical work in the idealised contact model. Energy and momentum classifications therefore require separate boundary checks.

### 8. Choose the model that answers the question

Use the center-of-mass momentum equation to analyse collective motion.

Use an extended-system energy account to explain where energy comes from and where it goes. Neither analysis removes the need for the other when both motion and internal changes matter.

### Worked reasoning example

**Situation:** A person on a low-friction wheeled board pushes away from a rigid rail. Treat the hand’s contact point as stationary during the idealised push.

1. The rail supplies an external impulse, changing the person–board system’s momentum.
2. The rail does no mechanical work through that stationary contact point.
3. Internal energy supplies the increase in motion.

The result does not violate energy conservation.

### Planned visual insertions

**Figure P15 — “Two displacement markers.”**
One marker tracks the center of mass; another tracks the force-application point. Their different motions are shown explicitly.

**Interactive P16 — “Stretch or translate?”**
Learners compare a point-particle account with an extended spring account. Separate indicators show center-of-mass motion and stored elastic energy. No rotational-energy calculations are introduced.

### Optional checks

**Check 1:** Does zero center-of-mass displacement guarantee zero external work?
**Answer:** No. The force-application points can move during deformation.

**Check 2:** Can a force change momentum while doing no mechanical work?
**Answer:** Yes, under an appropriate stationary-contact or perpendicular-force situation.

---

## 9.9 Rocket Propulsion

**Learning goal:** Explain propulsion through momentum exchange and interpret the ideal rocket model’s assumptions.

### 1. Choose the rocket–exhaust system

The complete system includes the rocket and all expelled exhaust.

The remaining rocket alone is a changing-mass subsystem. The combined rocket–exhaust collection provides the appropriate closed collection for a simple momentum-conservation argument.

### 2. Explain thrust without external air

The rocket acts on exhaust, directing it backward relative to the rocket. The exhaust acts on the rocket in the opposite direction.

A rocket does not need surrounding air to push against. Its propellant system provides the expelled matter; chemical rockets also carry the required oxidizer. [NASA thrust reference](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/rocket-thrust-equation/)

### 3. Specify the velocity reference frame

Exhaust speed relative to the rocket is different from exhaust velocity in an external inertial frame.

If the rocket is already moving quickly, newly expelled gas can still move forward in the external frame while moving backward relative to the rocket.

“Backward exhaust” must therefore identify the frame.

### 4. Relate thrust to exhaust momentum flow

In the ideal particle-exhaust model:

\[
T=u\dot m_{\mathrm{out}}
\]

Here \(u\) is the backward exhaust speed relative to the rocket and \(\dot m_{\mathrm{out}}\) is the positive mass-ejection rate.

Real nozzle thrust can also include an exit-pressure contribution. That contribution is outside this introductory simulation model.

### 5. Account for decreasing rocket mass

As propellant is expelled, the remaining rocket mass decreases.

If thrust remains constant in a force-free external environment, the remaining rocket’s acceleration increases as its mass decreases. This does not mean the total closed system gains momentum.

### 6. Interpret the ideal rocket equation

For constant relative exhaust speed and negligible external forces:

\[
\Delta v=u\ln\!\left(\frac{m_i}{m_f}\right)
\]

The relationship connects ideal velocity change with exhaust speed and mass ratio. A larger usable propellant fraction can increase the ideal velocity change, but the remaining dry mass must stay positive.

No logarithm evaluation is required in the learner checks. [NASA ideal-rocket reference](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ideal-rocket-equation/)

### 7. Separate burn rate from ideal final velocity change

Increasing mass-ejection rate can increase thrust for the same exhaust speed.

However, for the same initial-to-final mass ratio and constant exhaust speed in the ideal force-free model, changing how quickly the propellant is used does not by itself change the predicted total velocity increase.

It changes the timing and thrust history.

### 8. Follow the full system’s motion and energy

With negligible external force, the center of mass of the rocket plus all exhaust has constant velocity.

The rocket and exhaust can gain kinetic energy while their combined momentum remains conserved. That kinetic energy comes from internal energy released by the propulsion process.

This lesson excludes drag, changing gravitational conditions, staging optimisation and relativistic effects.

### Worked reasoning example

**Situation:** Two otherwise identical ideal rockets use the same propellant amount and the same relative exhaust speed in force-free space. One burns its propellant more rapidly.

1. Its thrust can be greater while burning.
2. Its burn duration is shorter.
3. With the same mass ratio and exhaust speed, the ideal total velocity change is unchanged.

The conclusion would need reconsideration if significant external forces were present.

### Planned visual insertions

**Simulation P17 — “Rocket and exhaust together.”**
A rocket ejects labelled packets. Separate arrows show rocket momentum, exhaust momentum and their total. All expelled mass remains included in the total even when packets leave the visible window.

**Interactive P18 — “Which frame?”**
A frame selector changes the displayed exhaust velocities while preserving the same physical event and momentum relationships.

**Graph P19 — “Mass ratio and ideal velocity change.”**
Horizontal axis: initial-to-final mass ratio. Vertical axis: ideal velocity change, optionally normalised by exhaust speed. The curve is generated from the stated ideal model, with no numerical-answer task.

### Optional checks

**Check 1:** Must exhaust move backward in the laboratory frame for a rocket to gain forward momentum?
**Answer:** No. The relevant exhaust direction is relative to the rocket.

**Check 2:** Does a faster burn necessarily give a greater ideal total velocity change?
**Answer:** No, not when exhaust speed and mass ratio are unchanged and external forces are negligible.

## Momentum chapter review — nine proposed questions

1. **Equal-mass carts move in opposite directions at equal speeds. Can their total momentum be zero while they have kinetic energy?**
   **Answer:** Yes. Momentum vectors cancel; kinetic energies add.

2. **Two unequal carts recoil from rest in an isolated horizontal system. Do they have equal speeds or equal momentum magnitudes?**
   **Answer:** Equal momentum magnitudes; their speeds differ.

3. **Two force–time graphs have equal signed areas. What do they share?**
   **Answer:** The same impulse component, regardless of differing peak forces.

4. **Does an inelastic collision necessarily reverse one object’s motion?**
   **Answer:** No. Direction reversal is not its defining condition.

5. **A proposed planar collision conserves x-momentum but not y-momentum, despite negligible external impulse in both directions. Is it valid?**
   **Answer:** No. Both component conditions must hold.

6. **Must the center of mass lie at a point occupied by material?**
   **Answer:** No. A uniform ring is a counterexample.

7. **A projectile fragments under uniform gravity. What determines its system center-of-mass acceleration?**
   **Answer:** The net external gravitational force divided by total mass, not the internal separation forces.

8. **A person gains motion while pushing against an ideal stationary rail. Must the rail supply the kinetic energy?**
   **Answer:** No. It can supply impulse while internal energy supplies the increase in motion.

9. **Why can a rocket accelerate in vacuum?**
   **Answer:** It exchanges momentum with expelled exhaust rather than requiring external air to push against.

---

**How I would package this later**

Each lesson would use the same reusable structure:

`source reference → learning goal → eight teaching sections → relevant visual → worked reasoning → optional checks → chapter review`

For implementation, each planned visual would also need:

- Labelled entities, axes, units and reference frames.
- A prediction before revealing an outcome.
- Keyboard controls, pause/step/reset and a reduced-motion alternative.
- A text explanation of the same physical state.
- Checks that conserve the appropriate energy, momentum or mass quantities.
- Explicit handling of limiting cases, such as stopping before a rough patch ends.
- Original diagrams rather than copied textbook figures.

The assessment items above are a **proposed supplementary teaching review**, not a replacement for the existing lesson activity packages or a change to completion rules. This is the English review draft; aligned Malay and Simplified Chinese versions would be required before publication.

**The app, lesson packages and deployment remain unchanged.**
