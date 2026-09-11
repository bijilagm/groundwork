# --- Build stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies first for faster rebuilds.
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# Build the executable jar.
COPY src ./src
RUN mvn -B -q clean package -DskipTests

# --- Run stage ---
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render provides PORT at runtime; Spring Boot reads it via application.yml.
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
