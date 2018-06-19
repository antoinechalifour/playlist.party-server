module.exports = function NamedError (message, name) {
  const err = new Error(message)
  err.name = name

  return err
}
