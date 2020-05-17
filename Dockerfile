# => Build container
FROM node:12
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .

# Default port exposure
EXPOSE 8000

CMD [ "yarn","run", "start" ]