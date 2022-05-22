# First Stage: to install and build dependencies
FROM node:16 as build

#set work directory
WORKDIR /app/client
ENV PATH /app/client/node_modules/.bint:$PATH

#install dependencies
COPY ./package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]

#production enviorment
# FROM nginx:1.17.8-alpine
# COPY --from=build /app/client-react/build /usr/share/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/conf.d
# EXPOSE 80
# CMD ["nginx", "-g", "daemmon off;"]
