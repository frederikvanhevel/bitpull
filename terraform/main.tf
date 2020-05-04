variable "GCLOUD_SERVICE_KEY" {}
variable "GOOGLE_PROJECT_ID" {}
variable "GCLOUD_CLUSTER_NAME" {}
variable "GCLOUD_CLUSTER_REGION" {}

terraform {
  backend "gcs" {}
}

provider "google" {
  credentials = var.GCLOUD_SERVICE_KEY
  project     = var.GOOGLE_PROJECT_ID
}


// CLUSTER CONFIGURATION

# resource "google_container_cluster" "mastercluster" {
#   name               = var.GCLOUD_CLUSTER_NAME
#   location           = var.GCLOUD_CLUSTER_REGION
#   min_master_version = "1.16.8-gke.4"
#   # We can't create a cluster with no node pool defined, but we want to only use
#   # separately managed node pools. So we create the smallest possible default
#   # node pool and immediately delete it.
#   remove_default_node_pool = true
#   initial_node_count       = 1

#   # network    = "custom-network"
#   # subnetwork = "subnet-us-west1-192"

#   # ip_allocation_policy {
#   #   cluster_ipv4_cidr_block  = "10.0.0.0/14"
#   #   services_ipv4_cidr_block = "10.193.0.0/20"
#   # }

#   # private_cluster_config {
#   #   enable_private_endpoint = false
#   #   enable_private_nodes    = true
#   #   master_ipv4_cidr_block  = "172.16.0.0/28"
#   # }

#   master_auth {
#     username = ""
#     password = ""

#     client_certificate_config {
#       issue_client_certificate = false
#     }
#   }
# }

// NODE POOL CONFIGURATION

resource "google_container_node_pool" "primary_nodes" {
  name       = "automanaged-node-pool"
  location   = var.GCLOUD_CLUSTER_REGION
  cluster    = var.GCLOUD_CLUSTER_NAME
  node_count = 2
  autoscaling {
    min_node_count = 1
    max_node_count = 3
  }
  management {
    auto_upgrade = false
    auto_repair  = false
  }

  node_config {
    preemptible  = true
    machine_type = "n1-standard-1"
    disk_size_gb = 20

    metadata = {
      disable-legacy-endpoints = true
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  }
}
