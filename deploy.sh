#!/bin/bash

# Function name and region
FUNCTION_NAME="myApi"
REGION="us-central1"
RUNTIME="nodejs18"

echo "Zipping source code..."
zip -r function-source.zip .

echo "Deploying function to GCP..."
gcloud functions deploy $FUNCTION_NAME \
  --runtime=$RUNTIME \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point=$FUNCTION_NAME \
  --region=$REGION \
  --source=. \
  --quiet

echo "Deployment complete!"
