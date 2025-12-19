# Step 1: Use an image with JDK to build the app
FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /app

# Step 2: Copy maven files and download dependencies
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Fix line endings and make mvnw executable
RUN dos2unix mvnw || sed -i 's/\r$//' mvnw
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Step 3: Copy source and build the jar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Step 4: Final tiny image to run the app
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]