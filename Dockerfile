# Use a lightweight Node image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the Next.js application for production
RUN npm run build

# Expose the Next.js port
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]