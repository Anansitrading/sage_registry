# CI, Release, And Audit

## CI Gates

Minimum useful CI for a harness repo:

1. `gitagent validate`
2. hook script existence and syntax checks
3. registry validation if the harness is cataloged
4. Claude/Codex parity checks when exports are generated
5. deployment gate on successful validation

For `sage_registry`, the current expectation is:

- `npm run validate`
- `npm run test:parity -- --agent <name>` when applicable

## Branch Promotion

Use branches as environments:

- `dev`: active authoring
- `staging`: candidate harness
- `main`: released harness

Promote through merge, not by copying files outside git.

## Useful Audit Commands

Diff harness surfaces only:

```bash
/home/david/Projects/sage_registry/codex-skills/gitagent-harness-vcs/scripts/harness-diff.sh /path/to/repo v1.0.0 HEAD
```

Blame one durable surface:

```bash
/home/david/Projects/sage_registry/codex-skills/gitagent-harness-vcs/scripts/harness-blame.sh /path/to/repo SOUL.md
```

Validate one harness:

```bash
/home/david/Projects/sage_registry/codex-skills/gitagent-harness-vcs/scripts/validate-harness-vcs.sh /path/to/agent
```

## Release Checklist

- control plane updated intentionally
- memory and knowledge changes reviewed
- hook additions are deterministic and validated
- SOD and human-review rules still match the operational flow
- `gitagent validate` passes
- registry or export parity checks pass
- deployment target is explicit
