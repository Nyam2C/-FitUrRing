if [ -f ../.env ]; then
  export $(grep -v '^#' ../.env | xargs)
fi

if [ "$SERVER_NAME" == "localhost" ]; then
    npm run dev
else
    npm run start
fi