(Once the issues below are sorted, please move this into an "archived"
subfolder, as this is not long term documentation.)

On Nov. 17, 2020 Apple announced a transition from Intel-based MacOS
machines to their own silicon based around the ARM64 machine language.

In production, we run on Linux x86_64 instruction set, but most of our
developers work on Mac machines, and because of the timing
of hiring, the \_majority of our team have new M1/ARM64 machines for
development.

As of December 26th, 2020, there are some packages that are incompatible
with running in "native" arm64 instruction set.

## FFI

ffi is a standard way to connect ruby code to native executables, and as
such this library had some incompatibilities. I could link to the long
PRs, but it's basically solved at this point.

By following the submodule trick mentioned in this ticket:
https://github.com/ffi/ffi/issues/845 I was able to get it working on my
Macbook Air.

Likely, the release after 14.1 ffi will have a more perm fix so we can
remove references to ffi in the Gemfile

## Argon2

We identified that the library `blind_index`, that we use for cyptographic
searching, used a gem called `argon2-kdf` (both by the same author) that
bundles in it's own static builds of both x86 darwin and linux and windows
builds, and they did not include a build for arm64 or universal.

Hampton opened this ticket: https://github.com/ankane/argon2-kdf/issues/3

In a matter of hours a branch was created and opened called `mac-universal`
and testing showed that it solves our issues.
