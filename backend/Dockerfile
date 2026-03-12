FROM eclipse-temurin:24-jdk-alpine AS build

WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Make mvnw executable and build the application
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:24-jre-alpine

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render assigns port dynamically, Spring Boot defaults to 8080. We expose 8080.
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
