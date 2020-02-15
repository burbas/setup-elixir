# setup-erlang

This action sets up an Erlang environment for use in a GitHub Actions
workflow by:

- Installing OTP
- (optional) Installing rebar3

**Note** Currently, this action currently only supports Actions' `ubuntu-` runtimes.

## Usage

See [action.yml](action.yml).

**Note** The OTP release version specification is [relatively
complex](http://erlang.org/doc/system_principles/versions.html#version-scheme).
For best results, we recommend specifying exact OTP version.
However, values like `22.x` are also accepted, and we attempt to resolve them
according to semantic versioning rules.

### Basic example

```yaml
on: push

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-erlang@v1
        with:
          otp-version: 22.2
      - run: rebar3 get-deps
      - run: rebar3 ct
```

### Matrix example

```yaml
on: push

jobs:
  test:
    runs-on: ubuntu-latest
    name: OTP ${{matrix.otp}}
    strategy:
      matrix:
        otp: [20.3, 21.3, 22.2]
        os: [ubuntu-latest, macOS-latest]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-erlang@v1
        with:
          otp-version: ${{matrix.otp}}
      - run: rebar3 compile
      - run: rebar3 ct
```

### Nova example

```yaml
on: push

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      db:
        image: postgres:11
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-erlang@v1
        with:
          otp-version: 22.2
      - run: rebar3 compile
      - run: rebar3 ct
```

## License

The scripts and documentation in this project are released under the [MIT license](LICENSE.md).

## Contributing

Check out [this doc](CONTRIBUTING.md).

## Current Status

This action is in active development.
