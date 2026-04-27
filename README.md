# life-insight-counselor

A Codex skill for life and career guidance that combines:

- evidence-oriented reflection
- BaZi and Zi Wei Dou Shu
- Western astrology
- HUMAN 3.0 style development mapping

This is not a fortune-telling prompt that throws mystical language at people.
It is a structured counseling skill designed to help users think through career, relationships, repeated life patterns, and short-term decisions with both rational and symbolic lenses.

## Source note

The development-mapping layer in this skill is partly inspired by Dan Koe's HUMAN 3.0 prompt:

- [Prompt: HUMAN 3.0 - Self-Discovery and Transformation Through AI](https://letters.thedankoe.com/p/prompt-human-30-self-discovery-and)

That source influenced the four-domain framing, stage logic, and the idea of AI as an accelerant across life domains.
This repository adapts those ideas into a more structured counseling workflow with explicit uncertainty handling, evidence transparency, and integration with Chinese metaphysical systems plus Western astrology.

## Why this exists

Most prompts in this space fall into one of two extremes:

- they are overly rational and miss the narrative, symbolic, and existential side of human decisions
- they are overly mystical and turn ambiguity into fake certainty

`life-insight-counselor` is built to sit in the middle.

It treats:

- science and behavior as the primary reasoning layer
- Chinese metaphysical systems as symbolic pattern language
- Western natal chart logic as supporting identity and growth language
- practical action as the final output

The goal is not to predict fate.
The goal is to produce better self-understanding and better decisions.

## What makes it different

### 1. Multi-layer reasoning, not one-note prompting

The skill integrates:

- scientific and behavioral interpretation
- BaZi structure and timing themes
- Zi Wei Dou Shu role and life-axis themes
- Western chart symbolism
- HUMAN 3.0 inspired development mapping across `Mind`, `Body`, `Spirit`, and `Vocation`

### 2. Transparent evidence handling

This skill explicitly separates:

- `hard support`
- `moderate support`
- `light symbolic support`

It also handles:

- true solar time
- day-boundary ambiguity
- time-sensitive chart uncertainty

So when a user asks, "what exactly supports this conclusion?", the skill can answer honestly.

### 3. Built for real decisions

The skill is designed for questions like:

- Should I stay in this role or change direction?
- Why do I keep repeating the same relationship pattern?
- Am I stuck because of fear, misfit, or timing?
- Is this AI transition real growth, or just a seductive narrative?

### 4. Chinese output quality

The skill includes explicit Chinese output-style guidance so it sounds like a grounded counselor, not a vague inspiration account or a theatrical mystic.

## Good use cases

- career direction
- promotion and positioning questions
- life transition and identity rebuilding
- relationship pattern diagnosis
- repeated self-sabotage loops
- short-term event strategy and timing-sensitive choices
- mixed rational + metaphysical self-inquiry

## Not for

- medical advice
- legal advice
- tax or investment decisions
- crisis response
- guaranteed prediction

## Skill structure

```text
life-insight-counselor/
├── SKILL.md
├── agents/openai.yaml
└── references/
    ├── consultation-template.md
    ├── example-prompts.md
    ├── frameworks/
    │   ├── science-lens.md
    │   ├── chinese-symbolic-lens.md
    │   ├── western-symbolic-lens.md
    │   ├── human3-integration.md
    │   ├── degradation-rules.md
    │   ├── question-patterns.md
    │   ├── time-and-evidence.md
    │   └── chinese-output-style.md
    └── examples/
        ├── life-path-example.md
        ├── event-strategy-example.md
        ├── relationship-example.md
        └── transparent-support-example.md
```

## Quick start

Use the skill name directly:

```text
Use $life-insight-counselor to help me think through a life question with both evidence-oriented and symbolic guidance.
```

You can also start from the bundled examples:

- [Example prompts](./life-insight-counselor/references/example-prompts.md)
- [Life-path consultation example](./life-insight-counselor/references/examples/life-path-example.md)
- [Event-strategy consultation example](./life-insight-counselor/references/examples/event-strategy-example.md)
- [Relationship consultation example](./life-insight-counselor/references/examples/relationship-example.md)
- [Transparent support breakdown example](./life-insight-counselor/references/examples/transparent-support-example.md)

## Example input

```text
Use $life-insight-counselor to help me evaluate a career decision.

My question: Should I move into an AI-related role or stay in my current business function?
My goal: career analysis and direction
Life stage: 32, mid-career, current organization in flux
Current pressure: loss of role clarity and fear of losing competitiveness
Background patterns: I often start strong, then fade when my role does not solidify

Birth date: 1994-03-14
Birth time: 00:50, exact
Birth place: Zhaoqing, Guangdong, China

Please keep the scientific layer primary, use symbolic support transparently, and end with practical guidance.
```

## Design principles

- Do not confuse symbolic systems with scientific proof
- Do not hide uncertainty
- Do not give fake precision when time data is unstable
- Do not stop at insight; convert it into action
- Prefer pattern recognition and decision support over prophecy

## If you want to contribute

Useful contributions include:

- better example consultations
- more robust framework references
- improved multilingual output styles
- clearer support for true solar time and chart transparency
- community testing with real prompts

## Files to read first

- [Main skill](./life-insight-counselor/SKILL.md)
- [Consultation template](./life-insight-counselor/references/consultation-template.md)
- [Example prompts](./life-insight-counselor/references/example-prompts.md)

## License

No license file is included yet. Add one before broad reuse if you want people to fork and remix this freely.
