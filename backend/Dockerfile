# ============================
# 1) Build Stage
# ============================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Proje dosyasını kopyala
COPY backend.csproj ./
RUN dotnet restore

# Tüm dosyaları kopyala ve publish et
COPY . .
RUN dotnet publish -c Release -o /app/publish

# ============================
# 2) Runtime Stage
# ============================
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Publish edilmiş dosyaları al
COPY --from=build /app/publish .

# SQLite DB için çalışma dizini
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "backend.dll"]
