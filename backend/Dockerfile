# BUILD aşaması
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# csproj kopyala ve restore
COPY *.csproj .
RUN dotnet restore

# tüm dosyaları kopyala ve build et
COPY . .
RUN dotnet publish -c Release -o out

# RUNTIME aşaması
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 8080
ENTRYPOINT ["dotnet", "backend.dll"]
