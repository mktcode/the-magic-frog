if ! git diff-index --quiet HEAD --
then
  echo "changes"
fi