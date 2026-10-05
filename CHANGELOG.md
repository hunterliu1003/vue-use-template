

## [0.1.1](https://github.com/hunterliu1003/vue-use-template/compare/0.1.0...0.1.1) (2026-10-05)


### Bug Fixes

* apply attrs, props and emits given as a getter ([41f99cb](https://github.com/hunterliu1003/vue-use-template/commit/41f99cbda5c60885bc2fdb1b39e9d3163857e0ba))
* render functional component slots instead of an empty comment ([a91d8b6](https://github.com/hunterliu1003/vue-use-template/commit/a91d8b65ae15cc2fc97316528dd6da672f8c5efc))

# [0.1.0](https://github.com/hunterliu1003/vue-use-template/compare/0.0.6...0.1.0) (2026-10-05)


### Bug Fixes

* keep hideOnUnmounted on by default when only some options are passed ([137e53a](https://github.com/hunterliu1003/vue-use-template/commit/137e53a0fde30b33be77f46bfad78032cdae9fcd))
* tell server renders apart by SSR context instead of window ([a979e86](https://github.com/hunterliu1003/vue-use-template/commit/a979e864ed25230e93545bc4c7f1d3bb2b175f0d))


### Features

* isolate templates per SSR render so they never leak across requests ([bbb7e2f](https://github.com/hunterliu1003/vue-use-template/commit/bbb7e2faa3805d3929b10bbc3ed113ea64edc995))
* render templates shown during setup into the server HTML ([33fbfa3](https://github.com/hunterliu1003/vue-use-template/commit/33fbfa33561a2771d02561fbacec368cd159d048))


### Performance Improvements

* let bundlers drop the default provider when only the template helpers are imported ([2b65fb5](https://github.com/hunterliu1003/vue-use-template/commit/2b65fb523922f38439297a6e9a3437de2100849b))
* stop re-rendering open templates without slots when another one opens ([2d123d6](https://github.com/hunterliu1003/vue-use-template/commit/2d123d6243cd1479ea63bb5fee1cb685ed73cea1))

## [0.0.6](https://github.com/hunterliu1003/vue-use-template/compare/0.0.4...0.0.6) (2024-10-22)


### Features

* do not support SSR ([ccf4640](https://github.com/hunterliu1003/vue-use-template/commit/ccf46404be7fd5a3f61830b3156365786d6a052e))

## [0.0.4](https://github.com/hunterliu1003/vue-use-template/compare/0.0.3...0.0.4) (2024-10-13)


### Features

* createTemplateProvider ([62a5d9a](https://github.com/hunterliu1003/vue-use-template/commit/62a5d9a7bdf8726a759192264ea8d448b9d2d2d6))

## [0.0.3](https://github.com/hunterliu1003/vue-use-template/compare/0.0.2...0.0.3) (2024-03-27)


### Features

* Allow to pass a ref, reactive, computed object as a parameter to useTemplate() and add test cases ([f2c20f0](https://github.com/hunterliu1003/vue-use-template/commit/f2c20f009cefc478e9b382bf2024bdd5c0d82d58))

## [0.0.2](https://github.com/hunterliu1003/vue-use-template/compare/0.0.1...0.0.2) (2024-03-26)


### Features

* export mergeTemplateAttrs ([6f54565](https://github.com/hunterliu1003/vue-use-template/commit/6f54565b318fe547655728ae85e9703d9ab87803))

## [0.0.1](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0...0.0.1) (2024-03-26)


### Bug Fixes

* ReferenceError: Cannot access 'vNodeFn' before initialization ([b159e1d](https://github.com/hunterliu1003/vue-use-template/commit/b159e1d728306135fd51f55d44d1649e541f45e8))

# [0.0.0](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.11...0.0.0) (2024-03-26)

# [0.0.0-beta.11](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.10...0.0.0-beta.11) (2024-03-17)


### Features

* export useProvider ([826fcdc](https://github.com/hunterliu1003/vue-use-template/commit/826fcdce135c983494751e187b304c7e127fea1d))

# [0.0.0-beta.10](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.9...0.0.0-beta.10) (2024-03-17)


### Features

* export templateToVNodeFn, isTemplate ([fcca3a9](https://github.com/hunterliu1003/vue-use-template/commit/fcca3a9384c19d3ba90a9c56c46cbba10317f252))

# [0.0.0-beta.9](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.8...0.0.0-beta.9) (2024-03-17)


### Features

* add showByDefault option to useTemplate ([962c168](https://github.com/hunterliu1003/vue-use-template/commit/962c168cfa43a43226bcf6238216b203a61e1de7))

# [0.0.0-beta.8](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.7...0.0.0-beta.8) (2024-03-17)

# [0.0.0-beta.7](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.6...0.0.0-beta.7) (2024-03-15)

# [0.0.0-beta.6](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.5...0.0.0-beta.6) (2024-02-22)


### Features

* 1. useTemplate support attrs, props, emits with ref, reactive, computed object 2. rename options.onUnmounted to options.hideOnUnmounted 3. add more test cases ([e1fa815](https://github.com/hunterliu1003/vue-use-template/commit/e1fa81528bdd2589f83182eb93b80ad21e953fed))

# [0.0.0-beta.5](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.4...0.0.0-beta.5) (2024-02-14)


### Features

* nuxt 3 ([56ea1c8](https://github.com/hunterliu1003/vue-use-template/commit/56ea1c83886005b8d49e6880f954825750c16547))

# [0.0.0-beta.4](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.3...0.0.0-beta.4) (2024-02-14)

# [0.0.0-beta.3](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.2...0.0.0-beta.3) (2024-02-14)

# [0.0.0-beta.2](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.1...0.0.0-beta.2) (2024-02-14)


### Bug Fixes

* export types ([576f901](https://github.com/hunterliu1003/vue-use-template/commit/576f9013c86a2a1219d307687375b5bb5ed3571f))

# [0.0.0-beta.1](https://github.com/hunterliu1003/vue-use-template/compare/0.0.0-beta.0...0.0.0-beta.1) (2024-02-14)


### Bug Fixes

* types path ([517a357](https://github.com/hunterliu1003/vue-use-template/commit/517a35745a768e38ca2c596e84d98859db89a6d2))

# 0.0.0-beta.0 (2024-02-14)


### Features

* vue-use-template ([ed30218](https://github.com/hunterliu1003/vue-use-template/commit/ed30218450f2e741d255ff7cbc91be0cbee7bc07))
